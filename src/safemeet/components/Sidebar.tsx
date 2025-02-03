import React, { useState } from "react";
import {
    Box,
    VStack,
    HStack,
    IconButton,
    Text,
    Button,
} from "@chakra-ui/react";
import {
    DrawerActionTrigger,
    DrawerBackdrop,
    DrawerBody,
    DrawerCloseTrigger,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerRoot,
    DrawerTitle,
    DrawerTrigger,
} from "@safemeet/components/ui/drawer";
import { FaHome, FaStar, FaUserFriends, FaVideo, FaPlus } from "react-icons/fa";

const Sidebar: React.FC = () => {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [open, setOpen] = useState(false);

    const toggleCollapse = () => setIsCollapsed(!isCollapsed);

    return (
        <Box
            as="nav"
            w={isCollapsed ? "60px" : "200px"}
            p={4}
            transition="width 0.2s"
            overflow="hidden"
        >
            <VStack align="start" spaceY={4}>
                <IconButton
                    aria-label="Toggle Collapse"
                    onClick={toggleCollapse}
                    variant="ghost"
                    colorScheme="teal">
                    {isCollapsed ? <FaPlus /> : <FaHome />}
                </IconButton>
                <HStack>
                    <FaHome />
                    {!isCollapsed && <Text>Home</Text>}
                </HStack>
                <HStack>
                    <FaStar />
                    {!isCollapsed && <Text>Favourites</Text>}
                </HStack>
                <HStack>
                    <FaUserFriends />
                    {!isCollapsed && <Text>People</Text>}
                </HStack>
                <HStack>
                    <FaVideo />
                    {!isCollapsed && <Text>Video Rooms</Text>}
                </HStack>
                <DrawerRoot open={open} onOpenChange={(e: any) => setOpen(e.open)}>
                    <DrawerBackdrop />
                    <DrawerTrigger asChild>
                        <Button
                            onClick={() => setOpen(true)}
                            variant="solid"
                            colorScheme="teal"
                        >
                            <FaPlus />
                            {!isCollapsed && "Create Space"}
                        </Button>
                    </DrawerTrigger>
                    <DrawerContent>
                        <DrawerHeader>
                            <DrawerTitle>Create a new space</DrawerTitle>
                        </DrawerHeader>
                        <DrawerBody>
                            <p>
                                {/* Add form or content for creating a new space */}
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                            </p>
                        </DrawerBody>
                        <DrawerFooter>
                            <DrawerActionTrigger asChild>
                                <Button variant="outline">Cancel</Button>
                            </DrawerActionTrigger>
                            <Button>Save</Button>
                        </DrawerFooter>
                        <DrawerCloseTrigger />
                    </DrawerContent>
                </DrawerRoot>
            </VStack>
        </Box>
    );
};

export default Sidebar;