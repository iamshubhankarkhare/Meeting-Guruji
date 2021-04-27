import React, { useState } from 'react';
import { Flex, Input, Button } from '@chakra-ui/react';

function InputMsg({ handleClick }) {
  const [newMsg, setNewMsg] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleClick(newMsg, setNewMsg);
    }
  };

  return (
    <Flex h="10%" mx="4" align="center">
      <Input
        w="75%"
        borderColor="blue.300"
        placeholder="Type your msg here..."
        value={newMsg}
        onKeyDown={(e) => handleKeyDown(e)}
        onChange={(e) => setNewMsg(e.target.value)}
      ></Input>
      <Button
        size="md"
        ml="4"
        colorScheme="teal"
        onClick={() => handleClick(newMsg, setNewMsg)}
      >
        Send
      </Button>
    </Flex>
  );
}

export default InputMsg;
