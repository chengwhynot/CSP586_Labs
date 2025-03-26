import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Divider, TextField, Button } from '@mui/material';
import axios from 'axios';

const PostDetail = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [reply, setReply] = useState('');
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/posts/${postId}`);
        setPost(response.data);
        setReplies(response.data.replies || []);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
  }, [postId]);

  const handleReplySubmit = async () => {
    const auth = JSON.parse(localStorage.getItem('auth'));
    const author = auth ? auth.username : 'Anonymous';
    const newReply = { content: reply, author: author, createdAt: new Date().toISOString() };
    const updatedReplies = [...replies, newReply];
    setReplies(updatedReplies);
    setReply('');

    try {
      await axios.post(`http://localhost:3001/api/posts/${postId}/replies`, newReply);
    } catch (error) {
      console.error('Error adding reply:', error);
    }
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
      <input type="hidden" value={post.id} />
    </Container>
  );
};

export default PostDetail;