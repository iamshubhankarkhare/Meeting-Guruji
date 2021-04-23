import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { Text, Flex, Button } from '@chakra-ui/react';
import io from 'socket.io-client';
import Chat from './Chat.js';
import Participants from './Participants.js';
import { useAuth } from '../../contexts/AuthContext.js';
import VideoTest from './VideoTest';
import ClipBoard from './ClipBoard';

let socket;
const Room = () => {
  const [showChat, setShowChat] = useState(true);
  const [participants, setParticipants] = useState([]);

  const { id } = useParams();
  console.log(id);
  const isTeacher = window.location.hash == '#init' ? true : false;
  const url = `${window.location.origin}/${id}`;
  console.log(isTeacher);

  const { currentUser } = useAuth();

  const ENDPOINT = 'http://localhost:5000/';
  useEffect(() => {
    socket = io(ENDPOINT);
    const roomId = id;
    socket.emit('join', { currentUser, roomId }, (error) => {
      console.log(error);
    });
    socket.on('getParticipants', (users) => {
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
  }, [ENDPOINT, currentUser, id]);

  const showChatHandler = (showChatState) => {
    setShowChat(showChatState);
  };
  return (
    <Flex h="100%">
      {isTeacher && <ClipBoard url={url} currentUser={currentUser} />}
      <Flex bg="gray.800" h="100%" w="75%" flexDirection="column">
        <Flex h="90%" justify="center" align="center">
          {socket && <VideoTest socket={socket} />}
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
          <>{socket && <Chat participants={participants} socket={socket} />}</>
        ) : (
          <Participants participants={participants} />
        )}
      </Flex>
    </Flex>
  );
};

export default Room;
