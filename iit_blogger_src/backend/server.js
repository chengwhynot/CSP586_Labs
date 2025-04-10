const express = require('express');
const axios = require('axios');
const fs = require('fs');
const https = require('https');
const cors = require('cors');
const morgan = require('morgan');
const { HttpsProxyAgent } = require('https-proxy-agent');
require('dotenv').config();

const app = express();
const port = 3001;

const elasticsearchUrl = 'https://localhost:9200';
const elasticsearchUsername = 'elastic';
const elasticsearchPassword = process.env.ELASTIC_PASSWORD;
const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL;
const MOCK_MODE = process.env.MOCK_MODE === 'true';
const NEED_PROXY = process.env.NEED_PROXY === 'true';
const HTTPS_PROXY_HOST = process.env.HTTPS_PROXY_HOST;
const HTTPS_PROXY_PORT = process.env.HTTPS_PROXY_PORT;
const HTTPS_PROXY_USER = process.env.HTTPS_PROXY_USER;
const HTTPS_PROXY_PASS = process.env.HTTPS_PROXY_PASS;

console.log('Elasticsearch Password:', elasticsearchPassword); // 输出日志，查看是否正确加载了密码
console.log('proxy enabled: ', NEED_PROXY);
console.log('https_proxy_host: ', HTTPS_PROXY_HOST);

const httpsAgent = new https.Agent({
  ca: fs.readFileSync('/Users/Q604934/.ssh/http_ca_elastic_local.crt'),
  rejectUnauthorized: false,
});

app.use(cors());
app.use(express.json());
app.use(morgan('combined')); // 使用 morgan 中间件记录请求日志

const mockPosts = [
  {
    id: 1,
    title: 'Mock Post 1',
    content: 'This is the content of mock post 1.',
    topic: 'Technology',
    author: 'User1',
    createdAt: new Date().toISOString(),
    replies: [],
  },
  {
    id: 2,
    title: 'Mock Post 2',
    content: 'This is the content of mock post 2.',
    topic: 'Travel',
    author: 'User2',
    createdAt: new Date().toISOString(),
    replies: [],
  },
  {
    id: 3,
    title: 'Mock Post 3',
    content: 'This is the content of mock post 3.',
    topic: 'Sports',
    author: 'User3',
    createdAt: new Date().toISOString(),
    replies: [],
  },
  {
    id: 4,
    title: 'Mock Post 4',
    content: 'This is the content of mock post 4.',
    topic: 'Culture',
    author: 'User4',
    createdAt: new Date().toISOString(),
    replies: [],
  },
  {
    id: 5,
    title: 'Mock Post 5',
    content: 'This is the content of mock post 5.',
    topic: 'Social',
    author: 'User5',
    createdAt: new Date().toISOString(),
    replies: [],
  },
];

app.post('/api/posts', async (req, res) => {
  const { title, content, topic, author, createdAt } = req.body;
  const id = Date.now();
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
    res.status(201).send({ id, title, content, topic, author, createdAt });
  } catch (error) {
    console.error('Error creating post:', error.message); // 输出错误日志
    res.status(500).send({ error: error.message });
  }
});

app.get('/api/posts', async (req, res) => {
  console.log('Received GET /api/posts request'); // 输出日志，记录请求
  if (MOCK_MODE) {
    // 返回测试数据
    return res.send(mockPosts);
  }

  try {
    const response = await axios.get(`${elasticsearchUrl}/posts/_search`, {
      auth: {
        username: elasticsearchUsername,
        password: elasticsearchPassword,
      },
      httpsAgent,
    });
    const hits = response.data.hits.hits;
    console.log('hits: ', hits);
    if (hits.length > 0) {
      res.send(hits.map((hit) => ({ id: hit._id, ...hit._source })));
    } else {
      res.send([]);
    }
  } catch (error) {
    console.error('Error fetching posts:', error.message); // 输出错误日志
    res.status(500).send({ error: error.message });
  }
});

app.get('/api/posts/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`Received GET /api/posts/${id} request`); // 输出日志，记录请求
  if (MOCK_MODE) {
    // 返回测试数据
    const post = mockPosts.find((p) => p.id === parseInt(id));
    return res.send(post || {});
  }

  try {
    const response = await axios.get(`${elasticsearchUrl}/posts/_doc/${id}`, {
      auth: {
        username: elasticsearchUsername,
        password: elasticsearchPassword,
      },
      httpsAgent,
    });
    if (response.data.found) {
      res.send({ id, ...response.data._source });
    } else {
      res.send({});
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

app.post('/api/generate-reply', async (req, res) => {
  const { content } = req.body;
  const open_ai_url = OPENAI_BASE_URL + '/chat/completions';
  console.info(open_ai_url);
  const useProxy = !open_ai_url.includes('localhost');
  const proxyAgent = useProxy ? new HttpsProxyAgent({
    host: HTTPS_PROXY_HOST,
    port: HTTPS_PROXY_PORT,
    auth: `${HTTPS_PROXY_USER}:${HTTPS_PROXY_PASS}`
  }) : null;

  try {
    const response = await axios.post(
      open_ai_url,
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: `Generate a reply for the post: ${content}` }],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        httpsAgent: NEED_PROXY? proxyAgent: null,
      }
    );
    console.info('OpenAI response: ', response.data);
    const generatedReply = response.data.choices[0].message.content;
    res.send({ reply: generatedReply });
  } catch (error) {
    console.error('Error generating reply:', error.message);
    res.status(500).send({ error: error.message });
  }
});

app.post('/api/posts/:id/replies', async (req, res) => {
  const { id } = req.params;
  const { content, author } = req.body;
  const createdAt = new Date().toISOString();
  console.log(`Received POST /api/posts/${id}/replies request:`, req.body); // 输出日志，记录请求体

  try {
    const postResponse = await axios.get(`${elasticsearchUrl}/posts/_doc/${id}`, {
      auth: {
        username: elasticsearchUsername,
        password: elasticsearchPassword,
      },
      httpsAgent,
    });

    if (!postResponse.data.found) {
      return res.status(404).send({ error: 'Post not found' });
    }

    const post = postResponse.data._source;
    if (!post.replies) {
      post.replies = [];
    }
    post.replies.push({ content, author, createdAt });

    await axios.put(
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

    res.status(201).send({ id, content, author, createdAt });
  } catch (error) {
    console.error('Error adding reply:', error.message); // 输出错误日志
    res.status(500).send({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});