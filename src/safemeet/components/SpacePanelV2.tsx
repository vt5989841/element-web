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

const SpacePanelV2 = () => {
    return <Sidebar />;
};

export default SpacePanelV2;
