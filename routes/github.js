const express = require('express');
const axios = require('axios');
const router = express.Router();

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const REPO_OWNER = process.env.GITHUB_REPO_OWNER;
const REPO_NAME = process.env.GITHUB_REPO_NAME;

router.get('/login', (req, res) => {
  const redirect_uri = 'https://github.com/login/oauth/authorize' +
    `?client_id=${CLIENT_ID}&scope=public_repo`;
  res.redirect(redirect_uri);
});

router.get('/callback', async (req, res) => {
  const code = req.query.code;
  try {
    const tokenRes = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: code
      },
      {
        headers: { Accept: 'application/json' }
      }
    );
    const access_token = tokenRes.data.access_token;
    res.json({ access_token });
  } catch (err) {
    res.status(500).json({ error: 'Failed to exchange code for token' });
  }
});

router.post('/post-message', async (req, res) => {
  const { token, message } = req.body;
  try {
    const issueRes = await axios.post(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues`,
      {
        title: `Kudo from user`,
        body: message
      },
      {
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json'
        }
      }
    );
    res.json({ success: true, issue_url: issueRes.data.html_url });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create issue' });
  }
});

module.exports = router;
