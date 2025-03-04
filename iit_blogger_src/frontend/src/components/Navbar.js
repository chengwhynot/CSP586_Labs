import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';

const Navbar = ({ auth, setAuth }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('auth');
    setAuth(null);
    navigate('/login');
  };

  const getAvatar = (username) => {
    if (username === 'admin') {
      return 'A'; 
    } else if (username === 'user') {
      return 'U'; 
    }
    return '';
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Blogging Platform
        </Typography>
        <Button color="inherit" component={Link} to="/">
          Home
        </Button>
        <Button color="inherit" component={Link} to="/create">
          Create Post
        </Button>
        <Button color="inherit" onClick={handleClick}>
          Topics
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>Culture</MenuItem>
          <MenuItem onClick={handleClose}>Social</MenuItem>
          <MenuItem onClick={handleClose}>Sports</MenuItem>
          <MenuItem onClick={handleClose}>Technology</MenuItem>
          <MenuItem onClick={handleClose}>Travel</MenuItem>
        </Menu>
        {auth ? (
          <>
            <Avatar style={{ marginLeft: '10px' }}>{getAvatar(auth.username)}</Avatar>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <Button color="inherit" component={Link} to="/login">
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;