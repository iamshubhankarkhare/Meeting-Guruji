import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Home from './components/Home';
import Room from './components/Room';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Route path="/" exact component={Home} />
        <PrivateRoute path="/room" component={Room} />
      </Router>
    </AuthProvider>
  );
}

export default App;
