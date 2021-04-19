import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Stack,
} from '@chakra-ui/react';

const SignUp = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const { signup, googleLogin } = useAuth();

  const handleSignUp = async (event) => {
    event.preventDefault();
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

  const handleGoogleLogin = async () => {
    try {
      await googleLogin();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <Heading>Sign-up</Heading>
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
          <Button onClick={() => handleGoogleLogin()}>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
              alt="Google logo"
              width="16px"
              height="16px"
              padding="0"
              margin="0 5px"
              vertical-align="middle"
            />
            Login With Google
          </Button>
        </Stack>
      </form>
      <br />
      <Link onClick={() => props.showSignupHandler(false)} color="blue.400">
        Already have an account? Sign-in
      </Link>
    </div>
  );
};

export default SignUp;
