const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const router = express.Router();

// Middleware to parse incoming JSON requests
router.use(bodyParser.json());

// Endpoint to handle attendance data request
router.post('/subject/attendance', async (req, res) => {
  const { netraID } = req.body;

  try {
    // Send a request to 'http://teleuniv.in/netra/api.php' with method '314' and rollno 'netraID'
    const response = await axios.post('http://teleuniv.in/netra/api.php', {
      method: '314',
      rollno: netraID
    });

    // Extract attendance data from the response
    const data = response.data.overallattperformance.overall;

    // Send the attendance data as JSON response
    res.json(data);
  } catch (error) {
    // If there's an error in fetching data from the external API
    console.error('Error fetching attendance data from external API:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
