import { Button, Flex, Text, VStack, type FlexProps } from "@chakra-ui/react";
import React from "react";
import { HomeIcon } from "./icons/HomeIcon";
import { ChatIcon } from "./icons/ChatIcon";
import { MeetIcon } from "./icons/MeetIcon";
import { CallIcon } from "./icons/CallIcon";
import { FolderIcon } from "./icons/FolderIcon";
import { ColorModeButton } from "./ui/color-mode";
import { SettingIcon } from "./icons/SettingIcon";
import UserMenu from "@components/structures/UserMenu";

export const Sidebar = (props: { className?: string; css?: FlexProps["css"] }) => {
    const { className, css } = props;

    return (
        <Flex className={className} direction="column" css={css} alignItems="center" justifyContent="space-between">
            <Flex direction="column" alignItems="center" gap={4}>
                <SidebarItem
                    icon={<HomeIcon />}
                    text="Home" />
                <SidebarItem
                    icon={<MeetIcon />}
                    text="Meets" />
                <SidebarItem
                    icon={<ChatIcon />}
                    text="Chats" />
                <SidebarItem
                    icon={<CallIcon />}
                    text="Calls" />
                <SidebarItem
                    icon={<FolderIcon />}
                    text="My Files" />
            </Flex>
            <Flex direction="column" p={2} alignItems="center" justifyContent="center">
                <ColorModeButton />
                <SidebarItem
                    icon={<SettingIcon />} />
                <UserMenu isPanelCollapsed />
            </Flex>
        </Flex>
    );
};

const SidebarItem = (props: { icon: React.ReactNode, text?: string }) => {
    const { icon, text } = props;

    return (
        <Button w={12} h={12} p={1} _icon={{ w: 5, h: 5 }}>
            <VStack>
                {icon}
                <Text fontSize="xs">{text}</Text>
            </VStack>
        </Button>
    );
};