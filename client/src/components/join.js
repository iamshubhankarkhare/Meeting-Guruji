import React, { useEffect } from 'react';
import io from 'socket.io-client';
import { Input, Flex, Button } from '@chakra-ui/react';

let socket;

function Join() {
  const ENDPOINT = 'http://localhost:5000/';
  const [name, setName] = React.useState('');
  const handleChange = (event) => setName(event.target.value);

  useEffect(() => {
    socket = io(ENDPOINT);
  }, [ENDPOINT]);

  const handleClick = () => {
    socket.emit('getrooms', { name }, (room) => {
      console.log(room);
      console.log(name);
      window.location.replace(`/room?name=${name}&room=${room}`);
    });
  };
  return (
    <Flex w="100%" h="100%">
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
  );
}

export default Join;
