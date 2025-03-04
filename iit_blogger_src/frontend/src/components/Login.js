import React, { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Login = ({ setAuth }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const users = {
    admin: 'admin',
    user: 'user'
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (users[username] && users[username] === password) {
      localStorage.setItem('auth', JSON.stringify({ username }));
      setAuth({ username });
      navigate('/');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
        />
        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}
        <Button type="submit" variant="contained" color="primary">
          Login
        </Button>
      </form>
    </Container>
  );
};

export default Login;