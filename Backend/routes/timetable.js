const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const router = express.Router();

// Middleware to parse incoming JSON requests
router.use(bodyParser.json());

// Endpoint to handle timetable data request
router.post('/timetable', async (req, res) => {
  const { netraID } = req.body;

  try {
    // Send a request to 'http://teleuniv.in/netra/api.php' with method '317' and rollno 'netraID'
    const response = await axios.post('http://teleuniv.in/netra/api.php', {
      method: '317',
      rollno: netraID
    });

    // Extract timetable data from the response
    const timetable = response.data.timetable;

    // Send the timetable data as JSON response
    res.json({ timetable });
  } catch (error) {
    // If there's an error in fetching data from the external API
    console.error('Error fetching timetable data from external API:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
