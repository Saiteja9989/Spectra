const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const router = express.Router();

router.use(bodyParser.json());

router.post('/netraqr', async (req, res) => {
  const { method } = req.body; // Assuming method is passed in the request body
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(400).json({ error: 'Token is missing' });
  }

  try {
    // Make a request to the external API with the provided method and token
    const response = await axios.post(
      'http://teleuniv.in/netra/netraapi.php',
      { method },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const hallticketno = response.data.hallticketno; // Extract hall ticket number from the response

    // Send the hall ticket number back to the client
    res.json({ hallticketno });
  } catch (error) {
    console.error('Error fetching hall ticket number:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
