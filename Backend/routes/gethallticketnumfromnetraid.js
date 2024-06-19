const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const router = express.Router();

router.use(bodyParser.json());

router.post('/netraqr', async (req, res) => {
  try {
    const { netraid, token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token not found in request body' });
    }

    // Make a request to the external API with the token as an Authorization header
    const response = await axios.post(
      'http://teleuniv.in/netra/netraapi.php',
      { method: '32' },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Extract hallticketno from the response
    const hallticketno = response.data.hallticketno;

    // Send hallticketno to the frontend
    res.json({ hallticketno });
  } catch (error) {
    console.error('Error processing netraid:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
