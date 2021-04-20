import React, { useState } from 'react';
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button,
  Icon,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Flex,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';

import { FcGoogle } from 'react-icons/fc';
import Header from './Header';
import Signup from '../Authentication/Signup';
import Signin from '../Authentication/Signin';
import { useAuth } from '../../contexts/AuthContext';
import Create from './Create';
import Join from './Join';

function GoogleIcon() {
  return <Icon as={FcGoogle} />;
}

const Home = () => {
  const [showSignup, setShowSignup] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const showSignupHandler = (show) => {
    setShowSignup(show);
  };

  const handleGoogleLogin = async () => {
    onClose();
    try {
      await googleLogin();
    } catch (err) {
      alert(err.message);
    }
  };

  const { currentUser, googleLogin } = useAuth();

  return (
    <>
      <Header showSignupHandler={showSignupHandler} />
      <Flex w="100%" h="92%">
        <Flex w="50%" mx="20" justify="center" flexDirection="column">
          <Stack spacing="24px" justify="center">
            <Text fontSize="7xl" color="gray.700" fontWeight="bolder">
              Meeting Guruji
            </Text>
            <Text color="gray.600" fontSize="2xl" fontWeight="bold">
              For students. By students!
            </Text>
            {!currentUser && (
              <Button
                _hover={{}}
                w="xs"
                bg="blue.500"
                color="white"
                py="4"
                onClick={onOpen}
              >
                Get started
              </Button>
            )}
            {currentUser && <Create />}
            {currentUser && <Join />}
          </Stack>
        </Flex>

        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <Tabs isFitted>
              <ModalHeader>
                <TabList>
                  <Tab>Sign In</Tab>
                  <Tab>Sign Up</Tab>
                </TabList>
              </ModalHeader>
              <ModalBody>
                <TabPanels>
                  <TabPanel>
                    <Signin showSignupHandler={showSignupHandler} />
                  </TabPanel>
                  <TabPanel>
                    <Signup showSignupHandler={showSignupHandler} />
                  </TabPanel>
                </TabPanels>
                <Flex justify="center" my="4">
                  <Button
                    w="sm"
                    onClick={() => handleGoogleLogin()}
                    leftIcon={<GoogleIcon />}
                  >
                    Login With Google
                  </Button>
                </Flex>
              </ModalBody>
            </Tabs>
          </ModalContent>
        </Modal>
      </Flex>
    </>
  );
};

export default Home;
