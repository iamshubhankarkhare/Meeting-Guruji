import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Home from './components/Home/Home';
import Room from './components/Room/Room';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/Routes/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Route path="/" exact component={Home} />
        <PrivateRoute path="/room/:id" component={Room} />
      </Router>
    </AuthProvider>
  );
}

export default App;
