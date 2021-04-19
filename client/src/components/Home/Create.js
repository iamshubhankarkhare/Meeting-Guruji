import React, { useEffect } from 'react';
import io from 'socket.io-client';
import { Flex, Button } from '@chakra-ui/react';
import { useAuth } from '../../contexts/AuthContext';

let socket;

const Create = () => {
  const { currentUser } = useAuth();

  const ENDPOINT = 'http://localhost:5000/';
  useEffect(() => {
    socket = io(ENDPOINT);
  }, [ENDPOINT]);

  const handleClick = () => {
    socket.emit('createRoom', { currentUser }, (room) => {
      console.log(room);
      window.location.replace(`room/${room}`);
    });
  };

  return (
    <Flex w="100%" h="100%">
      <Flex>
        <Button mt="8" size="lg" colorScheme="blue" onClick={handleClick}>
          Create New Meeting
        </Button>
      </Flex>
    </Flex>
  );
};

export default Create;
