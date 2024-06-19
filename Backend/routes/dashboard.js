const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const  StudentDetail=require('../models/studentDetails');
const router = express.Router();


router.use(bodyParser.json());
router.post('/profile', async (req, res) => {
  const { method } = req.body;
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(400).json({ error: 'Token is missing' });
  }

  try {
    // console.log('Sending request to external API');
    const response = await axios.post('http://teleuniv.in/netra/netraapi.php', {
      method: method,
      
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const profileData = response.data;
    // console.log('Received profile data:', profileData);

    if (!profileData.hallticketno) {
      return res.status(400).json({ error: 'Invalid response from external API' });
    }

    try {
      // Assuming profileData.hallticketno is the unique identifier for StudentDetail
      const student = await StudentDetail.findOne({ hallticketno: profileData.hallticketno });
      if (student) {
        profileData.psflag = student.psflag;
      }
    } catch (dbError) {
      console.error('Error fetching profile views from external database:', dbError);
      return res.status(500).json({ error: 'Error fetching profile views from database' });
    }

    try {
      // Fetch image from profileData.picture URL and convert to base64
      const imageResponse = await axios.get(profileData.picture, { responseType: 'arraybuffer' });
      const imageBuffer = Buffer.from(imageResponse.data, 'binary');
      profileData.picture = imageBuffer.toString('base64');
    } catch (imageError) {
      console.error('Error fetching or converting profile picture:', imageError);
      return res.status(500).json({ error: 'Error fetching or converting profile picture' });
    }

    res.json(profileData);
  } catch (apiError) {
    console.error('Error fetching profile data from external API:', apiError);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.post('/attendance', async (req, res) => {
  const { method } = req.body;
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  
    try {
      
      const response = await axios.post('http://teleuniv.in/netra/netraapi.php', {
        method: method,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          // 'Content-Type': 'application/json'
        }
      });
  
      console.log(response.data);
      const { attandance, overallattperformance } = response.data;
      const data = attandance.dayobjects;
      const data1 = overallattperformance.totalpercentage;
      const data2 = attandance.twoweeksessions;
  
      
      const attendanceData = {
        dayObjects: data,
        totalPercentage: data1,
        twoWeekSessions: data2
      };
  
      
      res.json(attendanceData);
    } catch (error) {
      console.error('Error fetching attendance data from external API:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

module.exports = router;