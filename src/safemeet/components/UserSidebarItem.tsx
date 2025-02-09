import { Box } from "@chakra-ui/react";
import BaseAvatar from "@components/views/avatars/BaseAvatar";
import { MatrixClientPeg } from "@src/MatrixClientPeg";
import { OwnProfileStore } from "@src/stores/OwnProfileStore";
import React, { useState } from "react";

import {
    DialogRoot,
    DialogTrigger,
    DialogContent,
    DialogBody,
    DialogCloseTrigger,
} from "@src/safemeet/components/ui/dialog";
import AccountUserSettingsTabV2 from "./settings/AccountUserSettingsTabV2";

export const UserSidebarItem = (props: { onClick?: () => void }) => {
    const [isOpen, setIsOpen] = useState(false);

    const avatarSize = 32; // should match border-radius of the avatar

    const userId = MatrixClientPeg.safeGet().getSafeUserId();
    const displayName = OwnProfileStore.instance.displayName || userId;
    const avatarUrl = OwnProfileStore.instance.getHttpAvatarUrl(avatarSize);

    return (
        <DialogRoot
            open={isOpen}
            onOpenChange={(e: { open: boolean }) => setIsOpen(e.open)}
            size="lg"
        >
            <DialogTrigger asChild>
                <Box className="mx_UserMenu" cursor="pointer" onClick={props.onClick}>
                    <div className="mx_UserMenu_userAvatar">
                        <BaseAvatar
                            idName={userId}
                            name={displayName}
                            url={avatarUrl}
                            size={avatarSize + "px"}
                            className="mx_UserMenu_userAvatar_BaseAvatar"
                        />
                    </div>
                </Box>
            </DialogTrigger>
            <DialogContent>
                <DialogBody>
                    <AccountUserSettingsTabV2
                        closeSettingsFn={() => setIsOpen(false)}
                    />
                </DialogBody>
                <DialogCloseTrigger />
            </DialogContent>
        </DialogRoot>
    );
};