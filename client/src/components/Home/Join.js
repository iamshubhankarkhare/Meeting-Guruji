import React from 'react';
import { Input, Flex, Button } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';

function Join() {
  const [roomId, setRoomId] = React.useState('');

  const handleChange = (event) => setRoomId(event.target.value);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      console.log('enter');
      handleClick();
    }
  };

  const history = useHistory();
  const handleClick = () => {
    const ar = roomId.split('/');
    history.push(`/${ar[ar.length - 1]}`);
  };

  return (
    <Flex w="100%" h="100%">
      <Flex>
        <Input
          my="2"
          placeholder="Enter meeting link"
          value={roomId}
          size="lg"
          w="sm"
          onKeyDown={(e) => handleKeyDown(e)}
          borderColor="blue.200"
          onChange={(e) => handleChange(e)}
        />
        <Button
          my="2"
          mx="4"
          size="lg"
          colorScheme="blue"
          onClick={() => handleClick()}
        >
          Join
        </Button>
      </Flex>
    </Flex>
  );
}

export default Join;
