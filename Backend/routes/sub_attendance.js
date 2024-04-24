const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const router = express.Router();


router.use(bodyParser.json());


router.post('/subject/attendance', async (req, res) => {
  const { netraID } = req.body;

  try {
    
    const response = await axios.post('http://teleuniv.in/netra/api.php', {
      method: '314',
      rollno: netraID
    });

    
    const data = response.data.overallattperformance.overall;

    
    res.json(data);
  } catch (error) {
    
    console.error('Error fetching attendance data from external API:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
