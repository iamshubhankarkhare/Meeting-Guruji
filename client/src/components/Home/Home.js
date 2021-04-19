import React, { useState } from 'react';
import { Text, Flex, Center, Stack } from '@chakra-ui/react';

import Header from './Header';
import Signup from '../Authentication/Signup';
import Signin from '../Authentication/Signin';
import { useAuth } from '../../contexts/AuthContext';
import Create from './Create';
import Join from './Join';

const Home = () => {
  const [showSignup, setShowSignup] = useState(true);

  const showSignupHandler = (show) => {
    setShowSignup(show);
  };

  const { currentUser } = useAuth();

  return (
    <>
      <Header showSignupHandler={showSignupHandler} />
      <Flex w="100%" h="92%">
        <Flex w="50%" mx="20" justify="center" flexDirection="column">
          <Stack>
            <Text fontSize="7xl" color="gray.700" fontWeight="bolder">
              Meeting Guruji
            </Text>
            <Text color="gray.600" fontSize="2xl" fontWeight="bold">
              For students. By students!
            </Text>
            {currentUser ? <Create /> : null}
            {currentUser ? <Join /> : null}
          </Stack>
        </Flex>
        {!currentUser ? (
          <Flex w="50%" justify="center" bg="blue.50">
            <Center>
              {showSignup === true ? (
                <Signup showSignupHandler={showSignupHandler} />
              ) : (
                <Signin showSignupHandler={showSignupHandler} />
              )}
            </Center>
          </Flex>
        ) : null}
      </Flex>
    </>
  );
};

export default Home;