import React, { useState } from 'react';
import { TextField, Button, Container, FormControl, MenuItem, InputLabel, Select } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const PostForm = ({ addPost, topics }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [topic, setTopic] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const auth = JSON.parse(localStorage.getItem('auth'));
    const author = auth ? auth.username : 'Anonymous';
    const newPost = {
      title,
      content,
      topic,
      author,
      createdAt: new Date().toISOString()
    };
    addPost(newPost);

    // Check if the topic is in the subscribed topics list
    const subscribedTopics = JSON.parse(localStorage.getItem('subscribedTopics')) || [];
    if (subscribedTopics.includes(topic)) {
      const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
      notifications.push({ topic, title });
      localStorage.setItem('notifications', JSON.stringify(notifications));
      // Trigger storage event to update notifications in Navbar
      window.dispatchEvent(new Event('storage'));
    }

    setTitle('');
    setContent('');
    setTopic('');
    navigate('/');
  };

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          fullWidth
          margin="normal"
          multiline
          rows={4}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Topic</InputLabel>
          <Select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          >
            {topics.map((topic, index) => (
              <MenuItem key={index} value={topic}>{topic}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button type="submit" variant="contained" color="primary">
          Create Post
        </Button>
      </form>
    </Container>
  );
};

export default PostForm;