const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const router = express.Router();

router.use(bodyParser.json());

router.post('/netraqr', async (req, res) => {
    try {
      const { netraid } = req.body;
  
      // Make a request to the external API
      const response = await axios.post('http://teleuniv.in/netra/api.php/profile', {
        method: "32",
        rollno: netraid
      });
  
      // Extract hallticketno from the response
      const hallticketno = response.data.hallticketno;
    //   console.log(hallticketno)
      // Send hallticketno to the frontend
      res.json({ hallticketno });
    } catch (error) {
      console.error('Error processing netraid:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
});
  

module.exports = router;