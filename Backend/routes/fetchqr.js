const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const router = express.Router();

router.use(bodyParser.json());

router.post('/fetchqr', async (req, res) => {
    try {
      const { hallticketno } = req.body;
  
      const response = await axios.get(`http://teleuniv.in/netra/studentQR/${hallticketno}.png`, {
        responseType: 'arraybuffer'
      });
  
      if (response.status === 200) {
        const imageData = Buffer.from(response.data, 'binary').toString('base64');
        const imageUrl = `data:image/png;base64,${imageData}`;
        res.json({ imageUrl });
      } else {
        res.status(500).json({ error: 'Failed to fetch QR image' });
      }
    } catch (error) {
      console.error('Error fetching QR image:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
module.exports = router;