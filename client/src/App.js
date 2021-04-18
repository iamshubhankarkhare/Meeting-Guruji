import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Home from './components/Home';
import Room from './components/room.js';
import { AuthProvider } from './contexts/AuthContext.js';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Route path="/" exact component={Home} />
        <Route path="/room" component={Room} />
      </Router>
    </AuthProvider>
  );
}

export default App;
