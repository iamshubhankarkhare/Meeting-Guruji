import React from 'react';
import axios from 'axios';
import { Flex, Button } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Create = () => {
  const { currentUser } = useAuth();

  const ENDPOINT = 'http://localhost:5000/';
  const history = useHistory();

  const handleClick = () => {
    const url = `${ENDPOINT}createRoom`;
    axios
      .post(url, { currentUser })
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
