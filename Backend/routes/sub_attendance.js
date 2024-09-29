const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const router = express.Router();

router.use(bodyParser.json());

router.post('/subject/attendance', async (req, res) => {
  const { method } = req.body;
  const token = req.headers.authorization.split(' ')[1]; 

  try {
   
    const response = await axios.post('http://apps.teleuniv.in/api/netraapi.php?college=KMIT', {
    method:method
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Origin': 'http://kmit-netra.teleuniv.in',
        'Referer': 'http://kmit-netra.teleuniv.in/'
      }
    });
    console.log(response.data);
    const data = response.data.overallattperformance.overall;
    res.json(data);
  } catch (error) {
    console.error('Error fetching attendance data from external API:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;