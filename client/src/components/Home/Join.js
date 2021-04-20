import React from 'react';
import { Input, Flex, Button } from '@chakra-ui/react';

function Join() {
  const [roomId, setRoomId] = React.useState('');
  const handleChange = (event) => setRoomId(event.target.value);

  const handleClick = () => {
    window.location.replace(`/room/${roomId}`);
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
          borderColor="blue.200"
          onChange={handleChange}
        />
        <Button
          my="2"
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
