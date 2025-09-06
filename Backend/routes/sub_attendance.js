const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const router = express.Router();

router.use(bodyParser.json());

router.post('/subject/attendance', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ error: 'Token missing' });
  }

  try {
    // Call the new attendance API
    const response = await axios.get('https://kmit-api.teleuniv.in/sanjaya/getSubjectAttendance', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Origin': 'https://kmit.teleuniv.in',
        'Referer': 'https://kmit.teleuniv.in/'
      }
    });

    // Process the response
    const payload = response.data.payload || [];
    
    // Transform the data to match the expected frontend format
    const transformedData = payload.map(subject => ({
      subjectname: subject.subjectName,
      percentage: subject.attendancePercentage,
      practical: "0.00", // Default value as the new API doesn't provide practical data
      totalSessions: subject.totalSessions,
      attendedSessions: subject.attendedSessions,
      subjectType: subject.subjectType
    }));

    res.json(transformedData);
  } catch (error) {
    console.error('Error fetching subject attendance data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;