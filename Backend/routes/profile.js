const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const router = express.Router();

// Middleware to parse incoming JSON requests
router.use(bodyParser.json());

// Endpoint to handle profile data request
router.post('/profile', async (req, res) => {
  const { method, rollno } = req.body;

  try {
    // Send a request to 'http://teleuniv.in/netra/api.php' with method and rollno
    const response = await axios.post('http://teleuniv.in/netra/api.php', {
      method: method,
      rollno: rollno
    });

    // Assuming the response data contains the profile information
    const profileData = response.data;

    // Send the profile data as JSON response
    res.json(profileData);
  } catch (error) {
    // If there's an error in fetching data from the external API
    console.error('Error fetching profile data from external API:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
