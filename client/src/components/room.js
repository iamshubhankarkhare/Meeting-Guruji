import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import { Text, Input, Flex, Button } from '@chakra-ui/react';

function Room({ location }) {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  useEffect(() => {
    const { name, room } = queryString.parse(location.search);
    console.log(name, room);
    setName(name);
    setRoom(room);
  }, []);
  return (
    <Flex>
      {name}
      {room}
    </Flex>
  );
}

export default Room;
