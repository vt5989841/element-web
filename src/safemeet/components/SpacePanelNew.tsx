/*
Copyright 2024 New Vector Ltd.
Copyright 2021, 2022 The Matrix.org Foundation C.I.C.

SPDX-License-Identifier: AGPL-3.0-only OR GPL-3.0-only OR LicenseRef-Element-Commercial
Please see LICENSE files in the repository root for full details.
*/

import React, {
    ComponentProps,
} from "react";

import { _t } from "@src/languageHandler";
import SpaceContextMenu from "@components/views/context_menus/SpaceContextMenu";
import IconizedContextMenu, {
    IconizedContextMenuCheckbox,
    IconizedContextMenuOptionList,
} from "@components/views/context_menus/IconizedContextMenu";
import SettingsStore from "@src/settings/SettingsStore";
import { SettingLevel } from "@src/settings/SettingLevel";
import { useSettingValue } from "@src/hooks/useSettings";
import UserMenu from "@components/structures/UserMenu";
import { Flex, IconButton, Spacer } from '@chakra-ui/react';
import { ChatIcon } from "./icons/ChatIcon";
import { MeetIcon } from "./icons/MeetIcon";
import { FolderIcon } from "./icons/FolderIcon";
import { HomeIcon } from "./icons/HomeIcon";
import { ColorModeButton } from "./ui/color-mode";
import { Sidebar } from "./Sidebar";

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

const SpacePanelNew = () => {
    return <Sidebar css={{ height: "100%", pt: 14 }} />;

    return (
        <Flex flexDirection="column" gap={4} height="100%" w={20}>
            <Flex flexDirection="column" gap={2} alignItems="center" justifyContent="center">
                <IconButton><HomeIcon /></IconButton>
                <IconButton><ChatIcon /></IconButton>
                <IconButton><MeetIcon /></IconButton>
                <IconButton><FolderIcon /></IconButton>
            </Flex>
            <Spacer />
            <Flex flexDirection="column" gap={2} p={2} alignItems="center" justifyContent="center">
                <ColorModeButton />
                <MoreItemsIcon />
                <UserMenu isPanelCollapsed />
            </Flex>
        </Flex>
    );
};

export default SpacePanelNew;

const MoreItemsIcon = () => {
    return (
        <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.75 18H20.75M5 12H20.75M13.25 6H20.75" stroke="black" stroke-width="1.875" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    );
};
