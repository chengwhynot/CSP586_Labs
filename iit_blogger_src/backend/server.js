const express = require('express');
const axios = require('axios');
const fs = require('fs');
const https = require('https');
const cors = require('cors');

const app = express();
const port = 3001;

const elasticsearchUrl = 'https://localhost:9200';
const elasticsearchUsername = 'elastic';
const elasticsearchPassword = process.env.ELASTIC_PASSWORD;

const httpsAgent = new https.Agent({
  ca: fs.readFileSync('/Users/Q604934/.ssh/http_ca_elastic_local.crt'),
  rejectUnauthorized: false,
});

app.use(cors());
app.use(express.json());

app.post('/api/posts', async (req, res) => {
  const { id, title, content, topic, author, createdAt, replies } = req.body;
  try {
    await axios.post(
      `${elasticsearchUrl}/posts/_doc/${id}`,
      { title, content, topic, author, createdAt, replies },
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
    res.status(500).send({ error: error.message });
  }
});

app.get('/api/posts', async (req, res) => {
  try {
    const response = await axios.get(`${elasticsearchUrl}/posts/_search`, {
      auth: {
        username: elasticsearchUsername,
        password: elasticsearchPassword,
      },
      httpsAgent,
    });
    res.send(response.data.hits.hits.map((hit) => hit._source));
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.get('/api/posts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.get(`${elasticsearchUrl}/posts/_doc/${id}`, {
      auth: {
        username: elasticsearchUsername,
        password: elasticsearchPassword,
      },
      httpsAgent,
    });
    res.send(response.data._source);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});