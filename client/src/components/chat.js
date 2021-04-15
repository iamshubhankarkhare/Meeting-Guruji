import React, { useState } from 'react';
import { Text, Input, Flex, Button } from '@chakra-ui/react';

function Chat({ messages }) {
  return (
    <Flex h="90%" flexDirection="column">
      {messages.map((message, i) => (
        <>
          <Flex w="100%" justify="space-between">
            <Text key={i} fontWeight="bold" mt="4" mx="4" color="gray.600">
              {message.user}
            </Text>
            <Text key={i} mt="4" mx="4" color="gray.400">
              {message.time}
            </Text>
          </Flex>
          <Text key={i} fontSize="md" mx="4">
            {message.text}
          </Text>
        </>
      ))}
    </Flex>
  );
}

export default Chat;
