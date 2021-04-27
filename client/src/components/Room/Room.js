import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useHistory } from 'react-router-dom';
import { Icon, Text, Flex, Button } from '@chakra-ui/react';
import { FcEndCall } from 'react-icons/fc';
import { BsFillMicMuteFill } from 'react-icons/bs';
import { FaVideoSlash } from 'react-icons/fa';

import io from 'socket.io-client';
import Chat from './Chat.js';
import Participants from './Participants.js';
import { useAuth } from '../../contexts/AuthContext.js';
import VideoTest from './VideoTest';
import ClipBoard from './ClipBoard';

let socket;

const Room = () => {
  const ChatParticipants = () => (
    <Flex mr="4" w="100%" justify="space-around" align="center" my="4">
      <Button
        mx="2"
        size="md"
        w="50%"
        colorScheme="teal"
        onClick={() => showChatHandler(true)}
      >
        Chat
      </Button>
      <Button
        mr="2"
        size="md"
        w="50%"
        colorScheme="teal"
        onClick={() => showChatHandler(false)}
      >
        {`Participants (${participants.length})`}
      </Button>
    </Flex>
  );
  const [showChat, setShowChat] = useState(true);
  const [participants, setParticipants] = useState([]);
  const [teacherAccess, setTeacherAcess] = useState(true);
  const [roomExists, setRoomExists] = useState(false);
  const [isMuted, setIsmuted] = useState(true);
  const [isVideoOff, setIsvideooff] = useState(false);
  const [isVisible, setIsvisible] = useState(false);

  const { id } = useParams();
  const history = useHistory();
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

  const handleEndCall = () => {
    console.log('ending call');
    history.push('/');
  };

  return (
    <>
      {roomExists ? (
        (isTeacher && teacherAccess) || !isTeacher ? (
          <Flex h="100%" flexDirection={['column', 'row']}>
            {isTeacher && <ClipBoard url={url} currentUser={currentUser} />}
            <Flex bg="gray.800" h="100%" w="100%" flexDirection="column">
              <Flex h="90%" justify="center" align="center">
                {socket && (
                  <VideoTest
                    socket={socket}
                    isMuted={isMuted}
                    isVideoOff={isVideoOff}
                  />
                )}
              </Flex>
              <Flex justify="center" h="10vh" align="center" bg="green.100">
                <Button
                  mx="6"
                  bg="none"
                  onClick={() => setIsvideooff(!isVideoOff)}
                >
                  <Icon
                    as={FaVideoSlash}
                    w={[8, 12]}
                    h={[8, 12]}
                    color={isVideoOff ? 'red' : 'black'}
                  />
                </Button>

                <Button mx="6" bg="none" onClick={() => setIsmuted(!isMuted)}>
                  <Icon
                    as={BsFillMicMuteFill}
                    w={[8, 12]}
                    h={[8, 12]}
                    color={isMuted ? 'red' : 'black'}
                  />
                </Button>
                <Button mx="6" bg="none" onClick={() => handleEndCall()}>
                  <Icon as={FcEndCall} w={[8, 12]} h={[8, 12]} />
                </Button>
              </Flex>
            </Flex>
            <Flex flexDirection="column" w={['sm', 'xl']} bg="white">
              <ChatParticipants />
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
            </Flex>
            )}
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
