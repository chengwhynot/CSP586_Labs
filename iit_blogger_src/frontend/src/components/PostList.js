import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Select, MenuItem, FormControl, InputLabel, Button } from '@mui/material';

const PostList = ({ posts, user, onSubscribe }) => {
  const [selectedTopic, setSelectedTopic] = useState('');
  const [subscribedTopics, setSubscribedTopics] = useState([]);

  useEffect(() => {
    // Fetch subscribed topics from localStorage
    const storedSubscribedTopics = JSON.parse(localStorage.getItem('subscribedTopics')) || [];
    setSubscribedTopics(storedSubscribedTopics);
  }, []);

  const handleTopicChange = (event) => {
    setSelectedTopic(event.target.value);
  };

  const handleSubscribe = () => {
    if (selectedTopic && !subscribedTopics.includes(selectedTopic)) {
      const newSubscribedTopics = [...subscribedTopics, selectedTopic];
      setSubscribedTopics(newSubscribedTopics);
      localStorage.setItem('subscribedTopics', JSON.stringify(newSubscribedTopics));
      alert(`Subscribed to ${selectedTopic} successfully!`);
      onSubscribe(newSubscribedTopics);
    }
  };

  const handleUnsubscribe = (topic) => {
    const newSubscribedTopics = subscribedTopics.filter(t => t !== topic);
    setSubscribedTopics(newSubscribedTopics);
    localStorage.setItem('subscribedTopics', JSON.stringify(newSubscribedTopics));
    alert(`Unsubscribed from ${topic} successfully!`);
    onSubscribe(newSubscribedTopics);
  };

  const filteredPosts = selectedTopic
    ? posts.filter((post) => post.topic === selectedTopic)
    : posts;

  const uniqueTopics = [...new Set(posts.map((post) => post.topic))];

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
        <FormControl style={{ width: '25%' }} margin="normal">
          <InputLabel id="topic-select-label">Filter by Topic</InputLabel>
          <Select
            labelId="topic-select-label"
            value={selectedTopic}
            onChange={handleTopicChange}
            label="Filter by Topic"
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            {uniqueTopics.map((topic, index) => (
              <MenuItem key={index} value={topic}>
                {topic}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" onClick={handleSubscribe} style={{ marginLeft: '16px' }}>
          Subscribe
        </Button>
      </div>
      <Grid container spacing={3}>
        {filteredPosts.map((post, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">
                  {post.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {post.content}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Topic: {post.topic}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Author: {post.author}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Created At: {new Date(post.createdAt).toLocaleString()}
                </Typography>
                {subscribedTopics.includes(post.topic) && (
                  <Button variant="contained" color="secondary" onClick={() => handleUnsubscribe(post.topic)}>
                    Unsubscribe
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default PostList;