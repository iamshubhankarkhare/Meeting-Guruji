import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import Join from './components/join.js';
import Room from './components/room.js';

function App() {
  return (
    <Router>
      <Route path="/" exact component={Join} />
      <Route path="/room" component={Room} />
    </Router>
  );
}

export default App;
