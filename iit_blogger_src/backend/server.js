const express = require('express');
const axios = require('axios');
const fs = require('fs');
const https = require('https');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const port = 3001;

const elasticsearchUrl = 'https://localhost:9200';
const elasticsearchUsername = 'elastic';
const elasticsearchPassword = process.env.ELASTIC_PASSWORD;

console.log('Elasticsearch Password:', elasticsearchPassword); // 输出日志，查看是否正确加载了密码

const httpsAgent = new https.Agent({
  ca: fs.readFileSync('/Users/Q604934/.ssh/http_ca_elastic_local.crt'),
  rejectUnauthorized: false,
});

app.use(cors());
app.use(express.json());
app.use(morgan('combined')); // 使用 morgan 中间件记录请求日志

app.post('/api/posts', async (req, res) => {
  const { id, title, content, topic, author, createdAt } = req.body;
  console.log('Received POST /api/posts request:', req.body); // 输出日志，记录请求体
  try {
    await axios.post(
      `${elasticsearchUrl}/posts/_doc/${id}`,
      { title, content, topic, author, createdAt },
      {
        auth: {
          username: elasticsearchUsername,
          password: elasticsearchPassword,
        },
        httpsAgent,
      }
    );
    res.status(201).send({ message: 'Post created' });
  } catch (error) {
    console.error('Error creating post:', error.message); // 输出错误日志
    res.status(500).send({ error: error.message });
  }
});

app.get('/api/posts', async (req, res) => {
  console.log('Received GET /api/posts request'); // 输出日志，记录请求
  try {
    const response = await axios.get(`${elasticsearchUrl}/posts/_search`, {
      auth: {
        username: elasticsearchUsername,
        password: elasticsearchPassword,
      },
      httpsAgent,
    });
    console.log("send out to es")
    const hits = response.data.hits.hits;
    console.log('hits: ', hits)
    if (hits.length > 0) {
      res.send(hits.map((hit) => hit._source));
    } else {
      res.send([]);
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      res.send({});
    } else {
      console.error('Error fetching post:', error.message); // 输出错误日志
      res.status(500).send({ error: error.message });
    }
  }
});

app.get('/api/posts/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`Received GET /api/posts/${id} request`); // 输出日志，记录请求
  try {
    const response = await axios.get(`${elasticsearchUrl}/posts/_doc/${id}`, {
      auth: {
        username: elasticsearchUsername,
        password: elasticsearchPassword,
      },
      httpsAgent,
    });
    if (response.data.found) {
      res.send(response.data._source);
    } else {
      res.send({});
    }
  } catch (error) {
    console.error('Error fetching post:', error.message); // 输出错误日志
    res.status(500).send({ error: error.message });
  }
});

app.get('/api/posts/:id/replies', async (req, res) => {
  const { id } = req.params;
  console.log(`Received GET /api/posts/${id}/replies request`); // 输出日志，记录请求
  try {
    const response = await axios.get(`${elasticsearchUrl}/posts/_doc/${id}`, {
      auth: {
        username: elasticsearchUsername,
        password: elasticsearchPassword,
      },
      httpsAgent,
    });
    if (response.data.found) {
      res.send(response.data._source.replies || []);
    } else {
      res.send([]);
    }
  } catch (error) {
    console.error('Error fetching replies:', error.message); // 输出错误日志
    res.status(500).send({ error: error.message });
  }
});

app.post('/api/posts/:id/replies', async (req, res) => {
  const { id } = req.params;
  const { content, author } = req.body;
  console.log(`Received POST /api/posts/${id}/replies request:`, req.body); // 输出日志，记录请求体
  try {
    const postResponse = await axios.get(`${elasticsearchUrl}/posts/_doc/${id}`, {
      auth: {
        username: elasticsearchUsername,
        password: elasticsearchPassword,
      },
      httpsAgent,
    });
    if (postResponse.data.found) {
      const post = postResponse.data._source;
      const newReply = { content, author, createdAt: new Date().toISOString() };
      const updatedReplies = [...(post.replies || []), newReply];
      post.replies = updatedReplies;

      await axios.post(
        `${elasticsearchUrl}/posts/_doc/${id}`,
        post,
        {
          auth: {
            username: elasticsearchUsername,
            password: elasticsearchPassword,
          },
          httpsAgent,
        }
      );
      res.status(201).send({ message: 'Reply added' });
    } else {
      res.status(404).send({ error: 'Post not found' });
    }
  } catch (error) {
    console.error('Error adding reply:', error.message); // 输出错误日志
    res.status(500).send({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Proxy server is running on http://localhost:${port}`);
});