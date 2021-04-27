import React, { useEffect, useState, useRef } from 'react';
import { Text, Input, Select, Button, Flex } from '@chakra-ui/react';

function ChatDisplay({ tempMsg }) {
  const messageEl = useRef(null);
  const [allMsgs, setAllmsgs] = useState([]);
  console.log(allMsgs);
  useEffect(() => {
    if (messageEl) {
      messageEl.current.addEventListener('DOMNodeInserted', (event) => {
        const { currentTarget: target } = event;
        target.scroll({ top: target.scrollHeight, behavior: 'smooth' });
      });
    }
  }, []);
  useEffect(() => {
    setAllmsgs([...allMsgs, tempMsg]);
  }, [tempMsg]);
  return (
    <Flex flexDirection="column" ref={messageEl} overflowY="scroll">
      {allMsgs &&
        allMsgs.map((message, i) => (
          <Flex key={i} flexDirection="column">
            <Flex w="100%" justify="space-between">
              <Text
                fontWeight="bold"
                mt="4"
                mx="4"
                color={`${message.user === 'Bot' ? 'gray.500' : ''}`}
                as={`${message.user === 'Bot' ? 'i' : ''}`}
              >
                {message.user && `${message.user} to ${message.to}`}
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
    </Flex>
  );
}

export default ChatDisplay;
