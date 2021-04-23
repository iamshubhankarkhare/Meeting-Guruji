import React, { useEffect } from 'react';
import axios from 'axios';
import { Flex, Button } from '@chakra-ui/react';
import { useAuth } from '../../contexts/AuthContext';
import { useHistory } from 'react-router-dom';

const Create = () => {
  const { currentUser } = useAuth();

  const ENDPOINT = 'http://localhost:5000/';
  const history = useHistory();
  //   socket = io(ENDPOINT);
  // }, [ENDPOINT]);
  //
  // const handleClick = () => {
  //   socket.emit('createRoom', { currentUser }, (room) => {
  //     console.log(room);
  //     window.location.replace(`room/${room}`);
  //   });
  // };

  const handleClick = () => {
    const url = `${ENDPOINT}createRoom`;
    axios
      .post(url, {
        todo: 'Buy the milk',
      })
      .then((res) => {
        console.log(res);
        history.push(`/${res.data}#init`);
      })
      .catch((error) => {
        console.error(error);
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
