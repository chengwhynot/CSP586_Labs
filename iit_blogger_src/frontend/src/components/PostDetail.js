import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Divider, TextField, Button } from '@mui/material';

const PostDetail = ({ posts }) => {
  const { postId } = useParams();
  const post = posts.find((p) => p.id === parseInt(postId));
  const [reply, setReply] = useState('');
  const [replies, setReplies] = useState(post?.replies || []);

  const handleReplySubmit = () => {
    const newReplies = [...replies, { content: reply, author: 'Current User', createdAt: new Date().toISOString() }];
    setReplies(newReplies);
    setReply('');
    // Update the post with the new replies in the main posts array
    if (post) {
      post.replies = newReplies;
      localStorage.setItem('posts', JSON.stringify(posts));
    }
  };

  if (!post) {
    return <Typography variant="h6">Post not found</Typography>;
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>{post.title}</Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {new Date(post.createdAt).toLocaleString()} | {post.topic} | {post.author}
      </Typography>
      <Typography variant="body1" paragraph>{post.content}</Typography>
      <Divider />
      <Typography variant="h6" gutterBottom>Replies</Typography>
      {replies.length === 0 ? (
        <Typography variant="body2" color="text.secondary">No replies yet.</Typography>
      ) : (
        replies.map((reply, index) => (
          <div key={index}>
            <Typography variant="body2" color="text.secondary">
              {reply.author} | {new Date(reply.createdAt).toLocaleString()}
            </Typography>
            <Typography variant="body1" paragraph>{reply.content}</Typography>
            <Divider />
          </div>
        ))
      )}
      <TextField
        label="Reply"
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        fullWidth
        margin="normal"
        multiline
        rows={4}
      />
      <Button variant="contained" color="primary" onClick={handleReplySubmit}>
        Submit Reply
      </Button>
    </Container>
  );
};

export default PostDetail;