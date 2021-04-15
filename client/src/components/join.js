import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { Text, Input, Flex, Button } from '@chakra-ui/react';

let socket;

function Join() {
  const ENDPOINT = 'http://localhost:5000/';
  const [name, setName] = React.useState('');
  const handleChange = (event) => setName(event.target.value);

  useEffect(() => {
    socket = io(ENDPOINT);
  }, [ENDPOINT]);

  useEffect(() => {
    socket.on('getrooms', (rooms) => {
      console.log(rooms);
    });
  }, []);

  const handleClick = () => {
    console.log(name);
    const room = 'room1';
    window.location.replace(`/room?name=${name}&room=${room}`);
  };
  return (
    <Flex w="100%" h="100%">
      <Flex w="50%" mx="20" justify="center" flexDirection="column">
        <Text fontSize="7xl" color="gray.700" fontWeight="bolder">
          Meeting Guruji
        </Text>
        <Text color="gray.600" fontSize="2xl" fontWeight="bold">
          For students. By students!
        </Text>
        <Flex>
          <Input
            my="8"
            placeholder="Enter your name"
            value={name}
            size="lg"
            w="sm"
            borderColor="blue.200"
            onChange={handleChange}
          />
          <Button
            my="8"
            mx="4"
            size="lg"
            colorScheme="blue"
            onClick={handleClick}
          >
            Join
          </Button>
        </Flex>
      </Flex>
      <Flex w="50%"></Flex>
    </Flex>
  );
}

export default Join;
