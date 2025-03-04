import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import PostForm from './components/PostForm';
import PostList from './components/PostList';
import Login from './components/Login';

const App = () => {
  const [posts, setPosts] = useState([]);
  const [auth, setAuth] = useState(null);
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
  }, []);

  const addPost = (post) => {
    const updatedPosts = [...posts, post];
    setPosts(updatedPosts);
    localStorage.setItem('posts', JSON.stringify(updatedPosts));
  };

  return (
    <Router>
      <Navbar auth={auth} setAuth={setAuth} />
      <Routes>
        <Route path="/" element={<PostList posts={posts} />} />
        <Route path="/create" element={<PostForm addPost={addPost} topics={topics} />} />
        <Route path="/login" element={<Login setAuth={setAuth} />} />
      </Routes>
    </Router>
  );
};

export default App;