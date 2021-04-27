import React, { useEffect, useState } from 'react';
import { Text, Select, Flex } from '@chakra-ui/react';
import InputMsg from './Input.js';
import ChatDisplay from './ChatDisplay';

const Chat = React.memo(({ participants, socket }) => {
  const [messageReceiver, setMessageReceiver] = useState('');

  const [tempMsg, setTempmsg] = useState('');

  useEffect(() => {
    if (socket) {
      socket.on('message', (message) => {
        setTempmsg(message);
      });
    }
  }, [socket]);

  //handle events
  //TODO: use enter key to send
  const handleSelectChange = (event) => {
    setMessageReceiver(event.target.value);
  };
  const handleClick = (newMsg, setNewMsg) => {
    socket.emit('sendMessage', {
      receiver: messageReceiver,
      message: newMsg,
      time: new Date().getHours() + ':' + new Date().getMinutes(),
    });
    setNewMsg('');
  };

  return (
    <Flex flexDirection="column" h="100%">
      <Flex align="center" my={2}>
        <Text ml="2" textAlign="middle">
          To:
        </Text>
        <Select
          placeholder="Everyone"
          w="40%"
          mx="4"
          onChange={handleSelectChange}
        >
          {participants.map(
            (participant, i) =>
              participant.socketId !== socket.id && (
                <option value={participant.socketId} key={i}>
                  {participant.name.length > 30
                    ? participant.name.substring(0, 27) + '...'
                    : participant.name}
                </option>
              )
          )}
        </Select>
      </Flex>
      <Flex justify="space-between" flexDirection="column" h="100%">
        <ChatDisplay tempMsg={tempMsg} />
        <InputMsg handleClick={handleClick} />
      </Flex>
    </Flex>
  );
});

export default Chat;
