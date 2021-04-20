import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button, FormControl, FormLabel, Input, Stack } from '@chakra-ui/react';

const SignUp = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const { signup } = useAuth();

  const handleSignUp = async (event) => {
    event.preventDefault();
    onClose();
    try {
      const userCredential = await signup(email, password);
      const user = userCredential.user;
      await user.updateProfile({
        displayName: name,
      });
      window.location.assign('/');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <form
        onSubmit={async (e) => {
          await handleSignUp(e);
        }}
      >
        <FormControl mt={4} isRequired>
          <FormLabel>Email address</FormLabel>
          <Input
            size="md"
            type="email"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <FormControl mt={4} isRequired>
          <FormLabel>Name</FormLabel>
          <Input
            size="md"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </FormControl>
        <FormControl mt={4} isRequired>
          <FormLabel htmlFor="Password">Password</FormLabel>
          <Input
            size="md"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>
        <br />
        <Stack>
          <Button type="submit" colorScheme="blue">
            Sign Up
          </Button>
        </Stack>
      </form>
    </div>
  );
};

export default SignUp;
