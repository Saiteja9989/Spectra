const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const router = express.Router();


router.use(bodyParser.json());


router.post('/timetable', async (req, res) => {
  const { netraID } = req.body;

  try {
    
    const response = await axios.post('http://teleuniv.in/netra/api.php', {
      method: '317',
      rollno: netraID
    });
    
    const timetable = response.data.timetable;
    res.json({ timetable });
  } catch (error) {
    console.error('Error fetching timetable data from external API:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
