import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from '@mui/material/Badge';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import axios from 'axios';

const Navbar = ({ auth, setAuth, subscribedTopics, onTopicSelect }) => {
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [location, setLocation] = useState('');
  const navigate = useNavigate();
  const topics = ["Culture", "Social", "Sports", "Technology", "Travel"];

  useEffect(() => {
    // Fetch notifications from localStorage
    const fetchNotifications = () => {
      const storedNotifications = JSON.parse(localStorage.getItem('notifications')) || [];
      setNotifications(storedNotifications);
    };

    fetchNotifications();

    // Listen for storage events to update notifications in real-time
    window.addEventListener('storage', fetchNotifications);

    return () => {
      window.removeEventListener('storage', fetchNotifications);
    };
  }, []);

  useEffect(() => {
    // Fetch location from third-party API
    const fetchLocation = async () => {
      try {
        const response = await axios.get('http://ip-api.com/json/');
        setLocation(response.data.city + ', ' + response.data.country);
      } catch (error) {
        console.error('Error fetching location:', error);
      }
    };

    fetchLocation();
  }, []);

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

  const handleNotificationsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setAnchorEl(null);
  };

  const handleClearNotifications = () => {
    localStorage.removeItem('notifications');
    setNotifications([]);
    handleNotificationsClose();
    // Trigger storage event to update notifications in Navbar
    window.dispatchEvent(new Event('storage'));
  };

  const handleTopicClick = (topic) => {
    onTopicSelect(topic);
    navigate('/');
  };

  const handleHomeClick = () => {
    onTopicSelect('');
    navigate('/');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Blogging Platform
        </Typography>
        <Typography variant="body1" style={{ marginRight: '16px' }}>
          {location}
        </Typography>
        <Button color="inherit" onClick={handleHomeClick}>
          Home
        </Button>
        {topics.map((topic, index) => (
          <Button key={index} color="inherit" onClick={() => handleTopicClick(topic)}>
            {topic}
          </Button>
        ))}
        <Button color="inherit" component={Link} to="/create">
          Create Post
        </Button>
        {auth ? (
          <>
            <IconButton color="inherit" onClick={handleNotificationsClick}>
              <Badge
                badgeContent={notifications.length}
                color="secondary"
                variant="dot"
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleNotificationsClose}
            >
              <MenuItem onClick={handleClearNotifications}>
                <ListItemText primary="Clear Notifications" />
              </MenuItem>
              {notifications.map((notification, index) => (
                <MenuItem key={index}>
                  <ListItemText primary={notification.title} secondary={notification.topic} />
                </MenuItem>
              ))}
            </Menu>
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