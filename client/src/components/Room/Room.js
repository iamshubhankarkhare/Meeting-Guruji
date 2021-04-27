import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import {
  useDisclosure,
  Text,
  Flex,
  Button,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react';
import io from 'socket.io-client';
import Chat from './Chat.js';
import Participants from './Participants.js';
import { useAuth } from '../../contexts/AuthContext.js';
import VideoTest from './VideoTest';
import ClipBoard from './ClipBoard';

let socket;

const Room = () => {
  const ChatParticipants = () => (
    <>
      <Flex mx="2">
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
    </>
  );
  const [showChat, setShowChat] = useState(true);
  const [participants, setParticipants] = useState([]);
  const [teacherAccess, setTeacherAcess] = useState(true);
  const [roomExists, setRoomExists] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  const { id } = useParams();
  const isTeacher = window.location.hash === '#init' ? true : false;
  const url = `${window.location.origin}/${id}`;

  const { currentUser } = useAuth();

  const ENDPOINT = process.env.REACT_APP_ENDPOINT;

  useEffect(() => {
    socket = io(ENDPOINT);
    const roomId = id;
    socket.emit('join', { currentUser, roomId, isTeacher }, (res) => {
      setTeacherAcess(res.teacherAccess);
      if (res.roomExists === undefined) setRoomExists(true);
      else setRoomExists(res.roomExists);
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

    socket.on('promoted', (user) => {
      alert(
        `You have been promoted to teacher role by ${user.displayName} (${user.email})!`
      );
      window.location.replace(`${url}#init`);
      socket.disconnect();
    });

    socket.on('demoted', (user) => {
      alert(
        `You have been demoted to student role by ${user.displayName} (${user.email})!`
      );
      window.location.replace(`${url}`);
      socket.disconnect();
    });
  }, [ENDPOINT, currentUser, id, isTeacher, url]);

  const showChatHandler = (showChatState) => {
    setShowChat(showChatState);
  };

  const handlePromotion = (participant) => {
    socket.emit(
      'promote',
      { participant, promoter: currentUser, roomId: id },
      (error) => {}
    );
  };

  const handleDemotion = (participant) => {
    socket.emit(
      'demote',
      { participant, demoter: currentUser, roomId: id },
      (error) => {}
    );
  };

  return (
    <>
      {roomExists ? (
        (isTeacher && teacherAccess) || !isTeacher ? (
          <Flex h="100%">
            {isTeacher && <ClipBoard url={url} currentUser={currentUser} />}
            <Flex bg="gray.800" h="100%" w="100%" flexDirection="column">
              <Flex h="90%" justify="center" align="center">
                {socket && <VideoTest socket={socket} />}
              </Flex>
              <Flex justify="center" h="10vh" align="center" bg="green.100">
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
            <Button ref={btnRef} colorScheme="teal" onClick={onOpen}>
              Open
            </Button>

            <Drawer
              isOpen={isOpen}
              size="sm"
              placement="right"
              onClose={onClose}
              finalFocusRef={btnRef}
            >
              <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>
                  <ChatParticipants />
                </DrawerHeader>
                <DrawerBody>
                  {showChat === true ? (
                    <>
                      {socket && (
                        <Chat participants={participants} socket={socket} />
                      )}
                    </>
                  ) : (
                    <Participants
                      participants={participants}
                      handlePromotion={handlePromotion}
                      handleDemotion={handleDemotion}
                    />
                  )}
                </DrawerBody>
              </DrawerContent>
            </Drawer>
          </Flex>
        ) : (
          'You are not allowed to view this page....'
        )
      ) : (
        'Room does not exist!'
      )}
    </>
  );
};

export default Room;
