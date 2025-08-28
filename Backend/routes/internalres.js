const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const router = express.Router();

router.use(bodyParser.json());

router.post('/internalResultData', async (req, res) => {
  try {
    const token = req.headers.authorization;
    const { rollno } = req.body;
    
    if (!token) {
      return res.status(401).json({ error: 'Authorization token required' });
    }
    
    if (!rollno) {
      return res.status(400).json({ error: 'Roll number is required' });
    }

    
    // Make request to internal results API
    const response = await axios.get(`https://kmit-api.teleuniv.in/sanjaya/getInternalResultsbyStudent/${rollno}`, {
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
        Accept: "application/json",
        Origin: "https://kmit.teleuniv.in",
        Referer: "https://kmit.teleuniv.in/"
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching internal result data:', error);
    
    if (error.response) {
      res.status(error.response.status).json({ 
        error: 'Error fetching internal result data',
        details: error.response.data 
      });
    } else if (error.request) {
      res.status(503).json({ error: 'No response from server' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});



module.exports = router;
