import { React } from 'react';
import { Box, Flex, Button, Text, HStack } from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';

const Header = (props) => {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      props.showSignupHandler(true);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Box bg="blue.100" px={4} h="8%">
      <Flex h="100%" alignItems={'center'} justifyContent={'space-between'}>
        <Box>Meeting Guruji</Box>
        {currentUser ? (
          <HStack>
            <Text>{currentUser.displayName}</Text>
            <Button onClick={handleLogout}>Logout</Button>
          </HStack>
        ) : null}
      </Flex>
    </Box>
  );
};

export default Header;
