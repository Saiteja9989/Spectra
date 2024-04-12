const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const router = express.Router();

// Middleware to parse incoming JSON requests
router.use(bodyParser.json());

router.post('/internalResultData', async (req, res) => {
    const { mid, rollno } = req.body;
  
    try {
      const response = await axios.get('http://teleuniv.in/trinetra/pages/lib/student_ajaxfile.php', {
        params: { mid, rollno }
      });
      // You might want to parse the HTML here before sending it to the client
      res.send(response.data);
    } catch (error) {
      console.error('Error fetching internal result data:', error);
      res.status(500).send('Error fetching internal result data');
    }
  });
  


module.exports = router;
