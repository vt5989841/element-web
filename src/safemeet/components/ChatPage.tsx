import React from "react";
import { Box } from "@chakra-ui/react";

interface ChatPageProps {
  flex?: string;
}

const ChatPage: React.FC<ChatPageProps> = ({ flex }) => {
  return <Box flex={flex} bg="white" p={4}>Chat Page Content</Box>;
};

export default ChatPage; 