import React from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';

const PostList = ({ posts }) => {
  return (
    <Grid container spacing={3}>
      {posts.map((post, index) => (
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
  );
};

export default PostList;