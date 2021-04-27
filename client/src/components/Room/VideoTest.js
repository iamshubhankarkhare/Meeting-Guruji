import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { SimpleGrid } from '@chakra-ui/react';
import Peer from 'peerjs';

import './VideoTest.css';

let peers = {};
const VideoBox = React.memo(({ socket, isMuted, isVideoOff }) => {
  const videoGrid = useRef(null);
  const [streamObj, setStreamobj] = useState();
  console.log(isVideoOff);

  useEffect(() => {
    const peer = new Peer();
    const myVideo = document.createElement('video');

    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((myStream) => {
        addVideoStream(myVideo, myStream);
        setStreamobj(myStream);

        // answering a call
        peer.on('call', (call) => {
          call.answer(myStream);
        });

        // participants already in the room
        socket.on('getPeers', (peerIds) => {
          peerIds.forEach((peerId) => {
            if (peerId !== peer.id) connectToNewUser(peerId, myStream);
          });
        });

        // new user in the room
        socket.on('user-connected', (peerId) => {
          console.log('new user:', peerId);
          connectToNewUser(peerId, myStream);
        });
      });

    peer.on('open', (id) => {
      socket.emit('peer-join', id);
    });

    socket.on('user-disconnected', (peerId) => {
      if (peers[peerId]) {
        peers[peerId].close();
      }
    });

    // call another peer
    function connectToNewUser(peerId, stream) {
      console.log('in connectToNewUser', peerId);

      const call = peer.call(peerId, stream);
      const video = document.createElement('video');
      call.on('stream', (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
      call.on('close', () => {
        video.remove();
      });

      peers[peerId] = call;
    }

    // add video element to videoGrid
    function addVideoStream(video, stream) {
      video.srcObject = stream;
      video.muted = isMuted;
      video.addEventListener('loadedmetadata', () => {
        video.play();
      });
      const node = ReactDOM.findDOMNode(videoGrid.current);
      node.appendChild(video);
    }
  }, [videoGrid, socket]);

  useEffect(() => {
    let video = document.querySelector('video');
    if (video) video.muted = !video.muted;
  }, [isMuted]);

  return (
    <SimpleGrid
      h="100%"
      spacing={0}
      w="100%"
      objectFit="cover"
      verticalAlign="middle"
      justifyItems="center"
      alignContent="center"
      minChildWidth={['200px', '480px']}
      ref={videoGrid}
    ></SimpleGrid>
  );
});

export default VideoBox;
