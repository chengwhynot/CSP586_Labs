import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Divider, TextField, Button } from '@mui/material';
import axios from 'axios';

const PostDetail = ({ posts }) => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [reply, setReply] = useState('');
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPost = () => {
      const storedPosts = JSON.parse(localStorage.getItem('posts')) || [];
      const post = storedPosts.find((p) => p.id === parseInt(postId));
      if (post) {
        setPost(post);
        setReplies(post.replies || []);
      }
    };

    fetchPost();
  }, [postId]);

  const handleReplySubmit = () => {
    const newReply = { content: reply, author: 'Current User', createdAt: new Date().toISOString() };
    const updatedReplies = [...replies, newReply];
    setReplies(updatedReplies);
    setReply('');

    // Update the post with the new replies in the main posts array
    const storedPosts = JSON.parse(localStorage.getItem('posts')) || [];
    const updatedPosts = storedPosts.map((p) => {
      if (p.id === parseInt(postId)) {
        return { ...p, replies: updatedReplies };
      }
      return p;
    });
    localStorage.setItem('posts', JSON.stringify(updatedPosts));
  };

  const handleGenerateReply = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3001/api/generate-reply', { content: post.content });
      const generatedReply = response.data.reply;
      setReply(generatedReply);
    } catch (error) {
      console.error('Error generating reply:', error);
    } finally {
      setLoading(false);
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6">Add a Reply</Typography>
        <Button variant="contained" color="primary" onClick={handleGenerateReply} disabled={loading}>
          {loading ? 'Generating...' : 'Generate Reply'}
        </Button>
      </div>
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