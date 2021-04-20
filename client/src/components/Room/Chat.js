import React from 'react';
import { Text, Flex } from '@chakra-ui/react';

const Chat = ({ messages }) => {
  return (
    <Flex h="80%" flexDirection="column">
      {messages.map((message, i) => (
        <Flex key={i} flexDirection="column">
          <Flex w="100%" justify="space-between">
            <Text
              fontWeight="bold"
              mt="4"
              mx="4"
              color={`${message.user === 'Bot' ? 'gray.500' : ''}`}
              as={`${message.user === 'Bot' ? 'i' : ''}`}
            >
              {`${message.user} to ${message.to}`}
            </Text>
            <Text mt="4" mx="4" color="gray.400">
              {message.time}
            </Text>
          </Flex>
          <Text
            fontSize="md"
            mx="4"
            color={`${message.user === 'Bot' ? 'gray.500' : ''}`}
            as={`${message.user === 'Bot' ? 'i' : ''}`}
          >
            {message.text}
          </Text>
        </Flex>
      ))}
      <div ref={messagesEndRef} />
    </Flex>
  );
};

export default Chat;
