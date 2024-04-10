const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const router = express.Router();

// Middleware to parse incoming JSON requests
router.use(bodyParser.json());

router.post('/internalresult', async (req, res) => {
    try {
      const response = await axios.get('http://teleuniv.in/trinetra/pages/lib/student_ajaxfile.php', {
        params: req.body
      });
      res.json(response.data);
    } catch (error) {
      console.error('Error fetching internal result data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


module.exports = router;
