const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const router = express.Router();

router.use(bodyParser.json());

router.post('/netraqr', async (req, res) => {
  const { method } = req.body; 
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1]; 

  if (!token) {
    return res.status(400).json({ error: 'Token is missing' });
  }

  try {
    const response = await axios.post(
      'http://apps.teleuniv.in/api/netraapi.php?college=KMIT',
      { method },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const hallticketno = response.data.hallticketno; 

    res.json({ hallticketno });
  } catch (error) {
    console.error('Error fetching hall ticket number:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;