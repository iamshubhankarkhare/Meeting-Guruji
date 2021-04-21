import React, { useState, useEffect } from 'react';
import { Text, Input, Flex, Button, Select } from '@chakra-ui/react';
import io from 'socket.io-client';
import Chat from './Chat';
import Participants from './Participants';
import VideoTest from './VideoTest';
import { useAuth } from '../../contexts/AuthContext';

const Room = ({ location }) => {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [showChat, setShowChat] = useState(true);
  const [participants, setParticipants] = useState([]);
  const [messageReceiver, setMessageReceiver] = useState('');
  const ENDPOINT = 'http://localhost:5000/';
  const [socket, setSocket] = useState(
    io(ENDPOINT, {
      pingTimeout: 30000,
    })
  );

  const { currentUser } = useAuth();

  useEffect(() => {
    const url = window.location.href;
    const roomId = url.substring(url.lastIndexOf('/') + 1, url.length);

    socket.emit('join', { currentUser, roomId }, (error) => {
      console.log(error);
    });
  }, [ENDPOINT, location, currentUser, socket]);

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages([...messages, message]);
    });
  }, [messages, socket]);

  useEffect(() => {
    socket.on('getParticipants', (users) => {
      console.log('All users in the room: ', users);

      const comparator = (userA, userB) => {
        if (userA.name < userB.name) return -1;
        else if (userA.name > userB.name) return 1;
        else {
          if (userA.email < userB.email) return -1;
          else if (userA.email > userB.email) return 1;
          else return 0;
        }
      };
      users.sort(comparator);

      const currentUser = users.find((user) => user.socketId === socket.id);
      users = users.filter((user) => user.socketId !== socket.id);
      users = [currentUser, ...users];
      setParticipants(users);
    });
  }, [socket]);

  const handleChange = (event) => setNewMsg(event.target.value);

  const handleClick = () => {
    console.log(newMsg);
    socket.emit(
      'sendMessage',
      {
        receiver: messageReceiver,
        message: newMsg,
        time: new Date().getHours() + ':' + new Date().getMinutes(),
      },
      () => setNewMsg('')
    );
  };

  const showChatHandler = (showChatState) => {
    setShowChat(showChatState);
  };

  const handleSelectChange = (event) => {
    setMessageReceiver(event.target.value);
  };

  return (
    <Flex h="100%">
      <Flex bg="blue.200" h="100%" w="75%" flexDirection="column">
        <Flex h="90%" justify="center" align="center">
          {/* Video Box */}
          <VideoTest socket={socket} />
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
        <Flex h="10%" mx="2">
          <Button
            size="md"
            mt="2"
            w="50%"
            border="1px"
            colorScheme="blue"
            onClick={() => showChatHandler(true)}
          >
            Chat
          </Button>
          <Button
            size="md"
            mt="2"
            w="50%"
            border="1px"
            colorScheme="blue"
            onClick={() => showChatHandler(false)}
          >
            {`Participants (${participants.length})`}
          </Button>
        </Flex>
        {showChat === true ? (
          <>
            <Chat messages={messages} />
            <Flex>
              <Text ml="2"> To: </Text>
              <Select
                placeholder="Everyone"
                w="40%"
                mx="4"
                mb="4%"
                onChange={handleSelectChange}
              >
                {participants.map((participant) =>
                  participant.socketId === socket.id ? null : (
                    <option value={participant.socketId}>
                      {participant.name.length > 30
                        ? participant.name.substring(0, 27) + '...'
                        : participant.name}
                    </option>
                  )
                )}
              </Select>
            </Flex>
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
          </>
        ) : (
          <Participants participants={participants} />
        )}
      </Flex>
    </Flex>
  );
};

export default Room;
