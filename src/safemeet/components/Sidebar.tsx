import { Button, Flex, Text, useRecipe, VStack } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { HomeIcon } from "./icons/HomeIcon";
import { ChatIcon } from "./icons/ChatIcon";
import { MeetIcon } from "./icons/MeetIcon";
import { CallIcon } from "./icons/CallIcon";
import { FolderIcon } from "./icons/FolderIcon";
import { useColorMode } from "./ui/color-mode";
import { SettingIcon } from "./icons/SettingIcon";
import UserMenu from "@components/structures/UserMenu";
import { useTheme } from "@src/hooks/useTheme";
import { useGlobalStore } from '../stores/useGlobalStore';

type TabType = "home" | "chats" | "meets" | "calls" | "files";

export const Sidebar = (props: { className?: string; isCollapsed?: boolean; }) => {
    const { className, isCollapsed } = props;
    
    const activeTab = useGlobalStore((state) => state.sidebar.activeTab);
    const setSidebarTab = useGlobalStore((state) => state.setSidebarTab);

    const elementTheme = useTheme();
    const { setColorMode } = useColorMode();
    const recipe = useRecipe({ key: "sidebar" });
    const styles = recipe({ isCollapsed });

    // Sync Element Web theme with Chakra UI
    useEffect(() => {
        // Element Web theme names typically include "light" or "dark"
        const isElementDarkTheme = elementTheme.theme.includes("dark");
        setColorMode(isElementDarkTheme ? "dark" : "light");
    }, [elementTheme.theme, setColorMode]);

    const handleTabClick = (tab: TabType) => {
        setSidebarTab(tab);
    };

    return (
        <Flex
            className={className}
            css={styles}
            colorPalette="brand">
            <Flex direction="column" alignItems="center" gap={4}>
                <SidebarItem
                    icon={<HomeIcon />}
                    text="Home"
                    isActive={activeTab === "home"}
                    onClick={() => handleTabClick("home")} />
                <SidebarItem
                    icon={<MeetIcon />}
                    text="Meets"
                    isActive={activeTab === "meets"}
                    onClick={() => handleTabClick("meets")} />
                <SidebarItem
                    icon={<ChatIcon />}
                    text="Chats"
                    isActive={activeTab === "chats"}
                    onClick={() => handleTabClick("chats")} />
                <SidebarItem
                    icon={<CallIcon />}
                    text="Calls"
                    isActive={activeTab === "calls"}
                    onClick={() => handleTabClick("calls")} />
                <SidebarItem
                    icon={<FolderIcon />}
                    text="My Files"
                    isActive={activeTab === "files"}
                    onClick={() => handleTabClick("files")} />
            </Flex>
            <Flex direction="column" p={2} alignItems="center" justifyContent="center" gap={4}>
                <SidebarItem
                    icon={<SettingIcon />} />
                <UserMenu isPanelCollapsed />
            </Flex>
        </Flex>
    );
};

interface SidebarItemProps {
    icon: React.ReactNode;
    text?: string;
    color?: string;
    isActive?: boolean;
    onClick?: () => void;
}

const SidebarItem = ({ 
    icon, 
    text, 
    color = "text.primary",
    isActive,
    onClick 
}: SidebarItemProps) => {
    const hasText = !!text;

    const recipe = useRecipe({ key: "button" });
    const styles = recipe({
        variant: "ghost",
        size: hasText ? "50x50" as any : "32x32"
    });

    return (
        <Button
            css={styles}
            color={color}
            aria-label={text || ""}
            colorPalette="brand"
            onClick={onClick}
            bg={isActive ? "bg.subtle" : "transparent"}
            _hover={{
                bg: "bg.subtle"
            }}
        >
            <VStack gap="2px">
                {icon}
                {text && <Text fontSize="xs">{text}</Text>}
            </VStack>
        </Button>
    );
};