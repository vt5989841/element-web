/*
Copyright 2024 New Vector Ltd.
Copyright 2021, 2022 The Matrix.org Foundation C.I.C.

SPDX-License-Identifier: AGPL-3.0-only OR GPL-3.0-only OR LicenseRef-Element-Commercial
Please see LICENSE files in the repository root for full details.
*/

import React, {
    ComponentProps,
    Dispatch,
    ReactNode,
    RefCallback,
    SetStateAction,
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "react";
import { DragDropContext, Draggable, DroppableProvidedProps } from "react-beautiful-dnd";
import classNames from "classnames";
import { Room } from "matrix-js-sdk/src/matrix";

import { _t } from "@src/languageHandler";
import { useContextMenu } from "@components/structures/ContextMenu";
import SpaceCreateMenu from "@components/views/spaces/SpaceCreateMenu";
import { SpaceButton, SpaceItem } from "@components/views/spaces/SpaceTreeLevel";
import { useEventEmitter, useEventEmitterState } from "@src/hooks/useEventEmitter";
import SpaceStore from "@src/stores/spaces/SpaceStore";
import {
    getMetaSpaceName,
    MetaSpace,
    SpaceKey,
    UPDATE_HOME_BEHAVIOUR,
    UPDATE_INVITED_SPACES,
    UPDATE_SELECTED_SPACE,
    UPDATE_TOP_LEVEL_SPACES,
} from "@src/stores/spaces";
import { RovingTabIndexProvider } from "@src/accessibility/RovingTabIndex";
import {
    RoomNotificationStateStore,
    UPDATE_STATUS_INDICATOR,
} from "@src/stores/notifications/RoomNotificationStateStore";
import SpaceContextMenu from "@components/views/context_menus/SpaceContextMenu";
import IconizedContextMenu, {
    IconizedContextMenuCheckbox,
    IconizedContextMenuOptionList,
} from "@components/views/context_menus/IconizedContextMenu";
import SettingsStore from "@src/settings/SettingsStore";
import { SettingLevel } from "@src/settings/SettingLevel";
import UIStore from "@src/stores/UIStore";
import { useSettingValue } from "@src/hooks/useSettings";
import UserMenu from "@components/structures/UserMenu";
import IndicatorScrollbar from "@components/structures/IndicatorScrollbar";
import { useDispatcher } from "@src/hooks/useDispatcher";
import defaultDispatcher from "@src/dispatcher/dispatcher";
import { ActionPayload } from "@src/dispatcher/payloads";
import { Action } from "@src/dispatcher/actions";
import { NotificationState } from "@src/stores/notifications/NotificationState";
import { KeyBindingAction } from "@src/accessibility/KeyboardShortcuts";
import { getKeyBindingsManager } from "@src/KeyBindingsManager";
import { shouldShowComponent } from "@src/customisations/helpers/UIComponents";
import { UIComponent } from "@src/settings/UIFeature";
import AccessibleButton from "@components/views/elements/AccessibleButton";
import { Landmark, LandmarkNavigation } from "@src/accessibility/LandmarkNavigation";
import { KeyboardShortcut } from "@components/views/settings/KeyboardShortcut";
import { Box, Flex, Spacer } from '@chakra-ui/react';
import { PopoverDemo } from "./PopoverDemo";

const useSpaces = (): [Room[], MetaSpace[], Room[], SpaceKey] => {
    const invites = useEventEmitterState<Room[]>(SpaceStore.instance, UPDATE_INVITED_SPACES, () => {
        return SpaceStore.instance.invitedSpaces;
    });
    const [metaSpaces, actualSpaces] = useEventEmitterState<[MetaSpace[], Room[]]>(
        SpaceStore.instance,
        UPDATE_TOP_LEVEL_SPACES,
        () => [SpaceStore.instance.enabledMetaSpaces, SpaceStore.instance.spacePanelSpaces],
    );
    const activeSpace = useEventEmitterState<SpaceKey>(SpaceStore.instance, UPDATE_SELECTED_SPACE, () => {
        return SpaceStore.instance.activeSpace;
    });
    return [invites, metaSpaces, actualSpaces, activeSpace];
};

export const HomeButtonContextMenu: React.FC<ComponentProps<typeof SpaceContextMenu>> = ({
    onFinished,
    hideHeader,
    ...props
}) => {
    const allRoomsInHome = useSettingValue("Spaces.allRoomsInHome");

    return (
        <IconizedContextMenu {...props} onFinished={onFinished} className="mx_SpacePanel_contextMenu" compact>
            {!hideHeader && <div className="mx_SpacePanel_contextMenu_header">{_t("common|home")}</div>}
            <IconizedContextMenuOptionList first>
                <IconizedContextMenuCheckbox
                    iconClassName="mx_SpacePanel_noIcon"
                    label={_t("settings|sidebar|metaspaces_home_all_rooms")}
                    active={allRoomsInHome}
                    onClick={() => {
                        onFinished();
                        SettingsStore.setValue("Spaces.allRoomsInHome", null, SettingLevel.ACCOUNT, !allRoomsInHome);
                    }}
                />
            </IconizedContextMenuOptionList>
        </IconizedContextMenu>
    );
};

interface IMetaSpaceButtonProps extends ComponentProps<typeof SpaceButton> {
    selected: boolean;
    isPanelCollapsed: boolean;
}

type MetaSpaceButtonProps = Pick<IMetaSpaceButtonProps, "selected" | "isPanelCollapsed">;

const MetaSpaceButton: React.FC<IMetaSpaceButtonProps> = ({ selected, isPanelCollapsed, size = "32px", ...props }) => {
    return (
        <li
            className={classNames("mx_SpaceItem", {
                collapsed: isPanelCollapsed,
            })}
            role="treeitem"
            aria-selected={selected}
        >
            <SpaceButton {...props} selected={selected} isNarrow={isPanelCollapsed} size={size} />
        </li>
    );
};

const getHomeNotificationState = (): NotificationState => {
    return SpaceStore.instance.allRoomsInHome
        ? RoomNotificationStateStore.instance.globalState
        : SpaceStore.instance.getNotificationState(MetaSpace.Home);
};

const HomeButton: React.FC<MetaSpaceButtonProps> = ({ selected, isPanelCollapsed }) => {
    const allRoomsInHome = useEventEmitterState(SpaceStore.instance, UPDATE_HOME_BEHAVIOUR, () => {
        return SpaceStore.instance.allRoomsInHome;
    });
    const [notificationState, setNotificationState] = useState(getHomeNotificationState());
    const updateNotificationState = useCallback(() => {
        setNotificationState(getHomeNotificationState());
    }, []);
    useEffect(updateNotificationState, [updateNotificationState, allRoomsInHome]);
    useEventEmitter(RoomNotificationStateStore.instance, UPDATE_STATUS_INDICATOR, updateNotificationState);

    return (
        <MetaSpaceButton
            spaceKey={MetaSpace.Home}
            className="mx_SpaceButton_home"
            selected={selected}
            isPanelCollapsed={isPanelCollapsed}
            label={getMetaSpaceName(MetaSpace.Home, allRoomsInHome)}
            notificationState={notificationState}
            ContextMenuComponent={HomeButtonContextMenu}
            contextMenuTooltip={_t("common|options")}
            size="32px"
        />
    );
};

const FavouritesButton: React.FC<MetaSpaceButtonProps> = ({ selected, isPanelCollapsed }) => {
    return (
        <MetaSpaceButton
            spaceKey={MetaSpace.Favourites}
            className="mx_SpaceButton_favourites"
            selected={selected}
            isPanelCollapsed={isPanelCollapsed}
            label={getMetaSpaceName(MetaSpace.Favourites)}
            notificationState={SpaceStore.instance.getNotificationState(MetaSpace.Favourites)}
            size="32px"
        />
    );
};

const PeopleButton: React.FC<MetaSpaceButtonProps> = ({ selected, isPanelCollapsed }) => {
    return (
        <MetaSpaceButton
            spaceKey={MetaSpace.People}
            className="mx_SpaceButton_people"
            selected={selected}
            isPanelCollapsed={isPanelCollapsed}
            label={getMetaSpaceName(MetaSpace.People)}
            notificationState={SpaceStore.instance.getNotificationState(MetaSpace.People)}
            size="32px"
        />
    );
};

const OrphansButton: React.FC<MetaSpaceButtonProps> = ({ selected, isPanelCollapsed }) => {
    return (
        <MetaSpaceButton
            spaceKey={MetaSpace.Orphans}
            className="mx_SpaceButton_orphans"
            selected={selected}
            isPanelCollapsed={isPanelCollapsed}
            label={getMetaSpaceName(MetaSpace.Orphans)}
            notificationState={SpaceStore.instance.getNotificationState(MetaSpace.Orphans)}
            size="32px"
        />
    );
};

const VideoRoomsButton: React.FC<MetaSpaceButtonProps> = ({ selected, isPanelCollapsed }) => {
    return (
        <MetaSpaceButton
            spaceKey={MetaSpace.VideoRooms}
            className="mx_SpaceButton_videoRooms"
            selected={selected}
            isPanelCollapsed={isPanelCollapsed}
            label={getMetaSpaceName(MetaSpace.VideoRooms)}
            notificationState={SpaceStore.instance.getNotificationState(MetaSpace.VideoRooms)}
            size="32px"
        />
    );
};

const CreateSpaceButton: React.FC<Pick<IInnerSpacePanelProps, "isPanelCollapsed" | "setPanelCollapsed">> = ({
    isPanelCollapsed,
    setPanelCollapsed,
}) => {
    const [menuDisplayed, handle, openMenu, closeMenu] = useContextMenu<HTMLDivElement>();

    useEffect(() => {
        if (!isPanelCollapsed && menuDisplayed) {
            closeMenu();
        }
    }, [isPanelCollapsed]); // eslint-disable-line react-hooks/exhaustive-deps

    let contextMenu: JSX.Element | undefined;
    if (menuDisplayed) {
        contextMenu = <SpaceCreateMenu onFinished={closeMenu} />;
    }

    const onNewClick = menuDisplayed
        ? closeMenu
        : () => {
            if (!isPanelCollapsed) setPanelCollapsed(true);
            openMenu();
        };

    return (
        <li
            className={classNames("mx_SpaceItem mx_SpaceItem_new", {
                collapsed: isPanelCollapsed,
            })}
            role="treeitem"
            aria-selected={false}
        >
            <SpaceButton
                data-testid="create-space-button"
                className={classNames("mx_SpaceButton_new", {
                    mx_SpaceButton_newCancel: menuDisplayed,
                })}
                label={menuDisplayed ? _t("action|cancel") : _t("create_space|label")}
                onClick={onNewClick}
                isNarrow={isPanelCollapsed}
                innerRef={handle}
                size="32px"
            />

            {contextMenu}
        </li>
    );
};

const metaSpaceComponentMap: Record<MetaSpace, typeof HomeButton> = {
    [MetaSpace.Home]: HomeButton,
    [MetaSpace.Favourites]: FavouritesButton,
    [MetaSpace.People]: PeopleButton,
    [MetaSpace.Orphans]: OrphansButton,
    [MetaSpace.VideoRooms]: VideoRoomsButton,
};

interface IInnerSpacePanelProps extends DroppableProvidedProps {
    children?: ReactNode;
    isPanelCollapsed: boolean;
    setPanelCollapsed: Dispatch<SetStateAction<boolean>>;
    isDraggingOver: boolean;
    innerRef: RefCallback<HTMLElement>;
}

// Optimisation based on https://github.com/atlassian/react-beautiful-dnd/blob/master/docs/api/droppable.md#recommended-droppable--performance-optimisation
const InnerSpacePanel = React.memo<IInnerSpacePanelProps>(
    ({ children, isPanelCollapsed, setPanelCollapsed, isDraggingOver, innerRef, ...props }) => {
        const [invites, metaSpaces, actualSpaces, activeSpace] = useSpaces();
        const activeSpaces = activeSpace ? [activeSpace] : [];

        const metaSpacesSection = metaSpaces
            .filter((key) => !(key === MetaSpace.VideoRooms && !SettingsStore.getValue("feature_video_rooms")))
            .map((key) => {
                const Component = metaSpaceComponentMap[key];
                return <Component key={key} selected={activeSpace === key} isPanelCollapsed={isPanelCollapsed} />;
            });

        return (
            <IndicatorScrollbar
                {...props}
                wrappedRef={innerRef}
                className="mx_SpaceTreeLevel"
                style={
                    isDraggingOver
                        ? {
                            pointerEvents: "none",
                        }
                        : undefined
                }
                element="ul"
                role="tree"
                aria-label={_t("common|spaces")}
            >
                {metaSpacesSection}
                {invites.map((s) => (
                    <SpaceItem
                        key={s.roomId}
                        space={s}
                        activeSpaces={activeSpaces}
                        isPanelCollapsed={isPanelCollapsed}
                        onExpand={() => setPanelCollapsed(false)}
                    />
                ))}
                {actualSpaces.map((s, i) => (
                    <Draggable key={s.roomId} draggableId={s.roomId} index={i}>
                        {(provided, snapshot) => (
                            <SpaceItem
                                {...provided.draggableProps}
                                dragHandleProps={provided.dragHandleProps}
                                key={s.roomId}
                                innerRef={provided.innerRef}
                                className={snapshot.isDragging ? "mx_SpaceItem_dragging" : undefined}
                                space={s}
                                activeSpaces={activeSpaces}
                                isPanelCollapsed={isPanelCollapsed}
                                onExpand={() => setPanelCollapsed(false)}
                            />
                        )}
                    </Draggable>
                ))}
                {children}
                {shouldShowComponent(UIComponent.CreateSpaces) && (
                    <CreateSpaceButton isPanelCollapsed={isPanelCollapsed} setPanelCollapsed={setPanelCollapsed} />
                )}
            </IndicatorScrollbar>
        );
    },
);

const SpacePanelNew: React.FC = () => {
    const [dragging, setDragging] = useState(false);
    const [isPanelCollapsed, setPanelCollapsed] = useState(true);
    const ref = useRef<HTMLDivElement>(null);
    useLayoutEffect(() => {
        if (ref.current) UIStore.instance.trackElementDimensions("SpacePanel", ref.current);
        return () => UIStore.instance.stopTrackingElementDimensions("SpacePanel");
    }, []);

    useDispatcher(defaultDispatcher, (payload: ActionPayload) => {
        if (payload.action === Action.ToggleSpacePanel) {
            setPanelCollapsed(!isPanelCollapsed);
        }
    });

    return (
        <RovingTabIndexProvider handleHomeEnd handleUpDown={!dragging}>
            {({ onKeyDownHandler, onDragEndHandler }) => (
                <DragDropContext
                    onDragStart={() => {
                        setDragging(true);
                    }}
                    onDragEnd={(result) => {
                        setDragging(false);
                        if (!result.destination) return; // dropped outside the list
                        SpaceStore.instance.moveRootSpace(result.source.index, result.destination.index);
                        onDragEndHandler();
                    }}
                >
                    <Box as="nav"
                        className={classNames("mx_SpacePanel", { collapsed: isPanelCollapsed })}
                        onKeyDown={(ev: React.KeyboardEvent<HTMLDivElement>) => {
                            const navAction = getKeyBindingsManager().getNavigationAction(ev);
                            if (
                                navAction === KeyBindingAction.NextLandmark ||
                                navAction === KeyBindingAction.PreviousLandmark
                            ) {
                                LandmarkNavigation.findAndFocusNextLandmark(
                                    Landmark.ACTIVE_SPACE_BUTTON,
                                    navAction === KeyBindingAction.PreviousLandmark,
                                );
                                ev.stopPropagation();
                                ev.preventDefault();
                                return;
                            }
                            onKeyDownHandler(ev);
                        }}
                        ref={ref}
                        aria-label={_t("common|spaces")}
                    >
                        <Flex flexDirection="column" gap={4} height="100%">
                            <Flex flexDirection="column" gap={2} alignItems="center" justifyContent="center">
                                <div><ChatIcon /></div>
                                <div><CallsIcon /></div>
                                <div><NotesIcon /></div>
                                <PopoverDemo />
                            </Flex>
                            <Spacer />
                            <Flex flexDirection="column" gap={2} p={2} alignItems="center" justifyContent="center">
                                <MoreItemsIcon />
                                <UserMenu isPanelCollapsed={isPanelCollapsed}>
                                    <AccessibleButton
                                        className={classNames("mx_SpacePanel_toggleCollapse", { expanded: !isPanelCollapsed })}
                                        onClick={() => setPanelCollapsed(!isPanelCollapsed)}
                                        title={isPanelCollapsed ? _t("action|expand") : _t("action|collapse")}
                                        caption={
                                            <KeyboardShortcut
                                                value={{ ctrlOrCmdKey: true, shiftKey: true, key: "d" }}
                                                className="mx_SpacePanel_Tooltip_KeyboardShortcut"
                                            />
                                        }
                                    />
                                </UserMenu>
                            </Flex>

                            {/* <Droppable droppableId="top-level-spaces">
                                {(provided, snapshot) => (
                                    <InnerSpacePanel
                                        {...provided.droppableProps}
                                        isPanelCollapsed={isPanelCollapsed}
                                        setPanelCollapsed={setPanelCollapsed}
                                        isDraggingOver={snapshot.isDraggingOver}
                                        innerRef={provided.innerRef}
                                    >
                                        {provided.placeholder}
                                    </InnerSpacePanel>
                                )}
                            </Droppable>

                            <ThreadsActivityCentre displayButtonLabel={!isPanelCollapsed} />

                            <QuickSettingsButton isPanelCollapsed={isPanelCollapsed} /> */}
                        </Flex>
                    </Box>
                </DragDropContext>
            )}
        </RovingTabIndexProvider>
    );
};

export default SpacePanelNew;


const ChatIcon = () => {
    return (
        <svg width="53" height="40" viewBox="0 0 53 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="53" height="40" rx="12" fill="#E4E4E4" />
            <path d="M18 19.9979C18.0005 18.0248 18.6493 16.1064 19.8468 14.5382C21.0442 12.9699 22.7239 11.8386 24.6272 11.3184C26.5306 10.7982 28.5522 10.9179 30.3808 11.6591C32.2095 12.4003 33.7438 13.722 34.7478 15.4206C35.7518 17.1192 36.1698 19.1007 35.9373 21.0602C35.7049 23.0196 34.835 24.8483 33.4614 26.2649C32.0879 27.6815 30.2869 28.6075 28.3356 28.9003C26.3843 29.1932 24.3908 28.8366 22.662 27.8855L19.1628 28.9511C19.0067 28.9987 18.8407 29.0029 18.6824 28.9633C18.5241 28.9238 18.3795 28.842 18.2641 28.7266C18.1488 28.6112 18.0669 28.4667 18.0274 28.3084C17.9878 28.1501 17.9921 27.984 18.0396 27.8279L19.1052 24.3233C18.3794 22.9972 17.9993 21.5097 18 19.9979ZM23.4 19.0979C23.4 19.3366 23.4948 19.5655 23.6636 19.7343C23.8324 19.9031 24.0613 19.9979 24.3 19.9979H29.7C29.9387 19.9979 30.1676 19.9031 30.3364 19.7343C30.5052 19.5655 30.6 19.3366 30.6 19.0979C30.6 18.8592 30.5052 18.6303 30.3364 18.4615C30.1676 18.2928 29.9387 18.1979 29.7 18.1979H24.3C24.0613 18.1979 23.8324 18.2928 23.6636 18.4615C23.4948 18.6303 23.4 18.8592 23.4 19.0979ZM24.3 21.7979C24.0613 21.7979 23.8324 21.8928 23.6636 22.0615C23.4948 22.2303 23.4 22.4592 23.4 22.6979C23.4 22.9366 23.4948 23.1655 23.6636 23.3343C23.8324 23.5031 24.0613 23.5979 24.3 23.5979H27.9C28.1387 23.5979 28.3676 23.5031 28.5364 23.3343C28.7052 23.1655 28.8 22.9366 28.8 22.6979C28.8 22.4592 28.7052 22.2303 28.5364 22.0615C28.3676 21.8928 28.1387 21.7979 27.9 21.7979H24.3Z" fill="#252B2F" />
        </svg>
    );
};

const CallsIcon = () => {
    return (
        <svg width="52" height="40" viewBox="0 0 52 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.8063 10.4681L21.9733 10.1171C22.6126 9.92433 23.3002 9.97073 23.9078 10.2477C24.5153 10.5246 25.0014 11.0131 25.2753 11.6221L26.1773 13.6281C26.4128 14.1519 26.4783 14.7363 26.3648 15.2992C26.2513 15.8622 25.9643 16.3755 25.5443 16.7671L24.0493 18.1601C24.0056 18.2008 23.9779 18.2558 23.9713 18.3151C23.9273 18.7121 24.1963 19.4851 24.8173 20.5601C25.2673 21.3411 25.6763 21.8901 26.0233 22.1971C26.2663 22.4121 26.3993 22.4581 26.4563 22.4421L28.4663 21.8271C29.0152 21.6592 29.6029 21.6673 30.147 21.8502C30.6911 22.0331 31.1643 22.3817 31.5003 22.8471L32.7803 24.6231C33.17 25.1631 33.3505 25.8261 33.2883 26.4891C33.2261 27.1521 32.9255 27.77 32.4423 28.2281L31.5553 29.0681C31.0851 29.5134 30.5075 29.8293 29.8789 29.9851C29.2503 30.1409 28.5921 30.1313 27.9683 29.9571C25.2143 29.1881 22.7453 26.8641 20.5333 23.0331C18.3193 19.1971 17.5413 15.8931 18.2593 13.1201C18.4205 12.4964 18.7396 11.9248 19.1859 11.4603C19.6321 10.9958 20.1896 10.6541 20.8063 10.4681ZM21.2403 11.9051C20.8702 12.0164 20.535 12.2212 20.267 12.4997C19.999 12.7782 19.8073 13.121 19.7103 13.4951C19.1083 15.8271 19.7973 18.7561 21.8333 22.2831C23.8673 25.8051 26.0563 27.8661 28.3733 28.5131C28.7476 28.6175 29.1425 28.6232 29.5196 28.5296C29.8968 28.436 30.2432 28.2464 30.5253 27.9791L31.4113 27.1391C31.6311 26.9309 31.7679 26.65 31.7962 26.3485C31.8245 26.0471 31.7425 25.7456 31.5653 25.5001L30.2853 23.7251C30.1325 23.5133 29.9173 23.3547 29.6698 23.2715C29.4223 23.1882 29.155 23.1846 28.9053 23.2611L26.8903 23.8781C25.7203 24.2261 24.6593 23.2851 23.5193 21.3101C22.7493 19.9801 22.3913 18.9501 22.4813 18.1491C22.5273 17.7331 22.7213 17.3491 23.0263 17.0631L24.5213 15.6701C24.7121 15.492 24.8424 15.2586 24.8939 15.0027C24.9454 14.7468 24.9154 14.4811 24.8083 14.2431L23.9073 12.2371C23.7828 11.9603 23.5618 11.7382 23.2856 11.6124C23.0094 11.4865 22.6969 11.4654 22.4063 11.5531L21.2403 11.9051Z" fill="#252B2F" />
        </svg>
    );
};

const NotesIcon = () => {
    return (
        <svg width="32" height="24" viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.2222 7.625H15.6978C15.265 7.62481 14.8472 7.46926 14.5227 7.1875L12.5031 5.4375H20C20.5894 5.4375 21.1546 5.66797 21.5713 6.0782C21.9881 6.48844 22.2222 7.04484 22.2222 7.625ZM22.2222 7.625C22.6937 7.625 23.1459 7.80937 23.4793 8.13756C23.8127 8.46575 24 8.91087 24 9.375V17.25C24 17.7141 23.8127 18.1592 23.4793 18.4874C23.1459 18.8156 22.6937 19 22.2222 19H9.77778C9.30628 19 8.8541 18.8156 8.5207 18.4874C8.1873 18.1592 8 17.7141 8 17.25V6.75C8 6.28587 8.1873 5.84075 8.5207 5.51256C8.8541 5.18437 9.30628 5 9.77778 5H11.3289C11.7616 5.00019 12.1794 5.15574 12.504 5.4375" stroke="#374957" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    );
};

const MoreItemsIcon = () => {
    return (
        <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.75 18H20.75M5 12H20.75M13.25 6H20.75" stroke="black" stroke-width="1.875" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    );
};
