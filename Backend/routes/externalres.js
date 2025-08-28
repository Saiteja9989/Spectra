const express = require('express');
const axios = require('axios');
const router = express.Router();

// External result data endpoint - changed to POST to accept body
router.post('/externalResultData', async (req, res) => {
  try {
    const token = req.headers.authorization;
    const { rollno } = req.body;
    
    if (!token) {
      return res.status(401).json({ error: 'Authorization token required' });
    }
    
    if (!rollno) {
      return res.status(400).json({ error: 'Roll number is required' });
    }

    // Make request to external API with proper headers
    const response = await axios.get(`https://kmit-api.teleuniv.in/ouresults/getcmm/${rollno}`, {
      headers: {
        Authorization: token, // Pass the original token
        "Content-Type": "application/json",
        Accept: "application/json",
        Origin: "https://kmit.teleuniv.in",
        Referer: "https://kmit.teleuniv.in/"
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching external result data:', error);
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      res.status(error.response.status).json({ 
        error: 'Error fetching external result data',
        details: error.response.data 
      });
    } else if (error.request) {
      // The request was made but no response was received
      res.status(503).json({ error: 'No response from server' });
    } else {
      // Something happened in setting up the request that triggered an Error
      res.status(500).json({ error: error.message });
    }
  }
});

module.exports = router;