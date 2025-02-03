import React from "react";
import { Box } from "@chakra-ui/react";

interface ChatSidebarProps {
  flex?: string;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ flex }) => {
  return <Box flex={flex} bg="gray.100" p={4}>Sidebar Content</Box>;
};

export default ChatSidebar; 