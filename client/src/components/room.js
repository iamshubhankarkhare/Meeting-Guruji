import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import { Text, Input, Flex, Button } from '@chakra-ui/react';
import io from 'socket.io-client';
import Chat from './chat.js';

let socket;
function Room({ location }) {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');

  const ENDPOINT = 'http://localhost:5000/';
  useEffect(() => {
    socket = io(ENDPOINT);
    const { name, room } = queryString.parse(location.search);
    console.log(name, room);
    setName(name);
    setRoom(room);

    socket.emit('join', { name, room }, (error) => {
      console.log(error);
    });
  }, [ENDPOINT, location]);

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages([...messages, message]);
    });
  }, [messages, name]);

  const handleChange = (event) => setNewMsg(event.target.value);

  const handleClick = () => {
    console.log(newMsg);
    socket.emit(
      'sendMessage',
      {
        message: newMsg,
        time: new Date().getHours() + ':' + new Date().getMinutes(),
      },
      () => setNewMsg('')
    );
  };
  return (
    <Flex h="100%">
      <Flex bg="blue.200" h="100%" w="75%" flexDirection="column">
        <Flex h="90%" justify="center" align="center">
          Video boxes
        </Flex>
        <Flex justify="center" h="10%" align="center" bg="white">
          <Text mx="6" size="md">
            Mute
          </Text>
          <Text mx="6" size="md">
            Video off
          </Text>
          <Text mx="6" size="md">
            End call
          </Text>
        </Flex>
      </Flex>
      <Flex h="100%" w="25%" flexDirection="column">
        <Chat messages={messages} />
        <Flex h="10%" mx="4">
          <Input
            w="75%"
            borderColor="blue.300"
            placeholder="Type your msg here..."
            value={newMsg}
            onChange={handleChange}
          ></Input>
          <Button size="md" ml="4" colorScheme="blue" onClick={handleClick}>
            Send
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default Room;