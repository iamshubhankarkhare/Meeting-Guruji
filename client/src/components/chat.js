import React, { useState, useEffect, useRef } from 'react';
import { Text, Input, Flex, Button } from '@chakra-ui/react';

function Chat({ messages }) {
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
              {message.user}
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
}

export default Chat;
