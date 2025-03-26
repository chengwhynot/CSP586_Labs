import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import PostForm from './components/PostForm';
import PostList from './components/PostList';
import PostDetail from './components/PostDetail';
import Login from './components/Login';

const App = () => {
  const [posts, setPosts] = useState([]);
  const [auth, setAuth] = useState(null);
  const [subscribedTopics, setSubscribedTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const topics = ["Culture", "Social", "Sports", "Technology", "Travel"];

  useEffect(() => {
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      setAuth(JSON.parse(storedAuth));
    }

    const storedPosts = localStorage.getItem('posts');
    if (storedPosts) {
      setPosts(JSON.parse(storedPosts));
    }

    const storedSubscribedTopics = JSON.parse(localStorage.getItem('subscribedTopics')) || [];
    setSubscribedTopics(storedSubscribedTopics);
  }, []);

  const addPost = (post) => {
    const newPost = { ...post, id: posts.length ? posts[posts.length - 1].id + 1 : 1 };
    const updatedPosts = [...posts, newPost];
    setPosts(updatedPosts);
    localStorage.setItem('posts', JSON.stringify(updatedPosts));
  };

  const handleSubscribe = (newSubscribedTopics) => {
    setSubscribedTopics(newSubscribedTopics);
    localStorage.setItem('subscribedTopics', JSON.stringify(newSubscribedTopics));
  };

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
  };

  return (
    <Router>
      <Navbar auth={auth} setAuth={setAuth} subscribedTopics={subscribedTopics} onTopicSelect={handleTopicSelect} />
      <Routes>
        <Route path="/" element={<PostList posts={posts} user={auth} onSubscribe={handleSubscribe} selectedTopic={selectedTopic} />} />
        <Route path="/create" element={<PostForm addPost={addPost} topics={topics} />} />
        <Route path="/post/:postId" element={<PostDetail posts={posts} />} />
        <Route path="/login" element={<Login setAuth={setAuth} />} />
      </Routes>
    </Router>
  );
};

export default App;