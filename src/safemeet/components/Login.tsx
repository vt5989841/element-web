import React from "react";
import { Box, Button, Flex, Input, Heading, Field, Stack } from "@chakra-ui/react";

const Login: React.FC = () => {
  return (
    <Flex height="100vh" alignItems="center" justifyContent="center" bg="gray.50">
      <Box p={8} maxWidth="400px" borderWidth={1} borderRadius={8} boxShadow="lg" bg="white">
        <Heading mb={6} textAlign="center">Login</Heading>
        <form>
          <Stack gap="4" css={{ "--field-label-width": "96px" }}>
            <Field.Root orientation="horizontal">
              <Field.Label>Email</Field.Label>
              <Input placeholder="Enter your email" flex="1" />
            </Field.Root>

            <Field.Root orientation="horizontal">
              <Field.Label>Password</Field.Label>
              <Input type="password" placeholder="Enter your password" flex="1" />
            </Field.Root>
          </Stack>
          <Button width="full" mt={4} colorScheme="teal" type="submit">
            Sign In
          </Button>
        </form>
      </Box>
    </Flex>
  );
};

export default Login; 