const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const router = express.Router();

router.use(bodyParser.json());

router.post('/timetable', async (req, res) => {
  const { method } = req.body;
  const token = req.headers.authorization.split(' ')[1]; // Extract the token from the Authorization header

  try {
    // Include the token in the request to the external API if required
    const response = await axios.post('http://teleuniv.in/netra/netraapi.php', {
      method: method,
     
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    const timetable = response.data.timetable;
    res.json({ timetable });
  } catch (error) {
    console.error('Error fetching timetable data from external API:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
