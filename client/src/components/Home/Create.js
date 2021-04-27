import React from 'react';
import axios from 'axios';
import { Flex, Button } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Create = () => {
  const { currentUser } = useAuth();

  const ENDPOINT = process.env.REACT_APP_ENDPOINT;
  const history = useHistory();

  const handleClick = () => {
    const url = `${ENDPOINT}createRoom`;
    axios
      .post(url, { currentUser })
      .then((res) => {
        history.push(`/${res.data}#init`);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <Flex w="100%" h="100%">
      <Flex>
        <Button
          mt="8"
          size="lg"
          w={['2xs', 'md']}
          colorScheme="blue"
          onClick={handleClick}
        >
          Create New Meeting
        </Button>
      </Flex>
    </Flex>
  );
};

export default Create;
