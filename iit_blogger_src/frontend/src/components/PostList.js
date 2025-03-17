import React, { useState } from 'react';
import { Grid, Card, CardContent, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const PostList = ({ posts }) => {
  const [selectedTopic, setSelectedTopic] = useState('');

  const handleTopicChange = (event) => {
    setSelectedTopic(event.target.value);
  };

  const filteredPosts = selectedTopic
    ? posts.filter((post) => post.topic === selectedTopic)
    : posts;

  const uniqueTopics = [...new Set(posts.map((post) => post.topic))];

  return (
    <>
      <FormControl fullWidth margin="normal">
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
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default PostList;