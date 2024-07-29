const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const router = express.Router();


router.use(bodyParser.json());

router.post('/externalResultData', async (req, res) => {
  const { year, semester, rollno } = req.body;

  try {
    const response = await axios.get('http://teleuniv.in/trinetra/pages/lib/student_ajaxfile.php', {
      params: { mid: 57, rollno:rollno, year:year, sem: semester }
    });
    console.log(response.data);
    // const parsedData = parseHtml1(response.data); // Parse HTML data
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching external result data:', error);
    res.status(500).json({ error: 'Error fetching external result data' });
  }
});

router.post('/backlogs', async (req, res) => {
  const { rollno } = req.body;

  try {
    const params = {
      mid: '58',
      rollno:rollno
    };
    const response = await axios.get('http://teleuniv.in/trinetra/pages/lib/student_ajaxfile.php', { params });
    // console.log(response.data.length)
    res.json(response.data.length);
  } catch (error) {
    console.error('Error fetching backlog data:', error);
    res.status(500).json({ error: 'Error fetching backlog data' });
  }
});

module.exports = router;
