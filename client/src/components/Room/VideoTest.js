import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import Peer from 'peerjs';

import './VideoTest.css';

const VideoBox = ({ socket }) => {
  const videoGrid = useRef(null);
  console.log('called');

  useEffect(() => {
    let peers = {};
    const peer = new Peer();
    const myVideo = document.createElement('video');

    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((myStream) => {
        addVideoStream(myVideo, myStream);

        // answering a call
        peer.on('call', (call) => {
          call.answer(myStream);
        });

        // participants already in the room
        socket &&
          socket.on('getPeers', (peerIds) => {
            peerIds.forEach((peerId) => {
              if (peerId !== peer.id) connectToNewUser(peerId, myStream);
            });
          });

        // new user in the room
        socket &&
          socket.on('user-connected', (peerId) => {
            console.log('new user:', peerId);
            connectToNewUser(peerId, myStream);
          });
      });

    socket &&
      peer.on('open', (id) => {
        socket.emit('peer-join', id);
      });

    socket &&
      socket.on('user-disconnected', (peerId) => {
        if (peers[peerId]) {
          // console.log(peer.id, 'closed', peerId);
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
      video.muted = true;
      video.addEventListener('loadedmetadata', () => {
        video.play();
      });
      const node = ReactDOM.findDOMNode(videoGrid.current);
      node.appendChild(video);
    }
  }, [videoGrid, socket]);

  return <div ref={videoGrid}></div>;
};

export default VideoBox;
