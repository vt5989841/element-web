import { Button, Flex, useRecipe } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { HomeIcon } from "./icons/HomeIcon";
import { ChatIcon } from "./icons/ChatIcon";
import { MeetIcon } from "./icons/MeetIcon";
import { CallIcon } from "./icons/CallIcon";
import { FolderIcon } from "./icons/FolderIcon";
import { useColorMode } from "./ui/color-mode";
import UserMenu from "@components/structures/UserMenu";
import { useTheme } from "@src/hooks/useTheme";
import { useGlobalStore } from '../stores/useGlobalStore';
import { Tooltip } from "./ui/tooltip";
import { VStack } from "@chakra-ui/react";

type TabType = "home" | "chats" | "meets" | "calls" | "files" | "settings" | "profile";

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
            colorPalette="brand"
            pt={12}
            direction="column"
            h="100vh">
            <Flex direction="column" alignItems="center" gap={4} flex={1}>
                <SidebarItem
                    icon={<HomeIcon />}
                    label="Home"
                    isActive={activeTab === "home"}
                    onClick={() => handleTabClick("home")} />
                <SidebarItem
                    icon={<MeetIcon />}
                    label="Meets"
                    isActive={activeTab === "meets"}
                    onClick={() => handleTabClick("meets")} />
                <SidebarItem
                    icon={<ChatIcon />}
                    label="Chats"
                    isActive={activeTab === "chats"}
                    onClick={() => handleTabClick("chats")} />
                <SidebarItem
                    icon={<CallIcon />}
                    label="Calls"
                    isActive={activeTab === "calls"}
                    onClick={() => handleTabClick("calls")} />
                <SidebarItem
                    icon={<FolderIcon />}
                    label="My Files"
                    isActive={activeTab === "files"}
                    onClick={() => handleTabClick("files")} />
            </Flex>
            {/* Bottom menu items */}
            <VStack>
                {/* <SidebarItem
                    icon={<SettingsIcon />}
                    label="Settings"
                    onClick={() => { }}
                    isActive={activeTab === "settings"}
                /> */}
                {/* <UserSidebarItem /> */}
                <UserMenu isPanelCollapsed />
            </VStack>
        </Flex>
    );
};

interface SidebarItemProps {
    icon: React.ReactNode;
    label: string;
    isActive?: boolean;
    onClick?: () => void;
}

const SidebarItem = ({
    icon,
    label,
    isActive,
    onClick
}: SidebarItemProps) => {
    const recipe = useRecipe({ key: "button" });
    const styles = recipe({
        variant: "ghost",
        size: "32x32" as any  // only need one size since text is no longer displayed
    });

    return (
        <Tooltip
            content={label}
            hasArrow
            openDelay={300}
            gutter={8}
            positioning={{
                placement: "right"
            }}
        >
            <Button
                css={styles}
                aria-label={label}
                onClick={onClick}
                bg={isActive ? "bg.subtle" : "transparent"}
                _hover={{
                    bg: "bg.subtle"
                }}
            >
                {icon}
            </Button>
        </Tooltip>
    );
};