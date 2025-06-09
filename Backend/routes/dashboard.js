const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const StudentDetail = require('../models/studentDetails');
const router = express.Router();

router.use(bodyParser.json());
router.post('/profile', async (req, res) => {
  const { method } = req.body;
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1]; 

  if (!token) {
    return res.status(400).json({ error: 'Token is missing' });
  }

  try {
    const response = await axios.post('http://apps.teleuniv.in/api/netraapi.php?college=KMIT', {
      method: method,
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Origin': 'http://kmit-netra.teleuniv.in',
        'Referer': 'http://kmit-netra.teleuniv.in/'
      }
    });

    const imGroup = {
      "8522036270": "https://spectraserver-indol.vercel.app/public/images/Ashish.png"
    };

    if (Object.keys(imGroup).includes(String(response.data.phone))) {
      response.data.picture = imGroup[String(response.data.phone)];
    }

    const profileData = response.data;
    console.log('Received profile data:', profileData);

    if (!profileData.hallticketno) {
      return res.status(400).json({ error: 'Invalid response from external API' });
    }

    try {
      const student = await StudentDetail.findOne({ hallticketno: profileData.hallticketno });
      if (student) {
        profileData.psflag = student.psflag;
      }
    } catch (dbError) {
      console.error('Error fetching profile views from external database:', dbError);
      return res.status(500).json({ error: 'Error fetching profile views from database' });
    }

    try {
      // Only convert to base64 if it's a teleuniv.in URL
      if (profileData.picture && profileData.picture.includes('teleuniv.in')) {
        const imageResponse = await axios.get(profileData.picture, { 
          responseType: 'arraybuffer',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Origin': 'http://kmit-netra.teleuniv.in',
            'Referer': 'http://kmit-netra.teleuniv.in/'
          }
        });
        const imageBuffer = Buffer.from(imageResponse.data, 'binary');
        profileData.picture = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;
      }
      // For other URLs (like our deployed server), keep them as is
    } catch (imageError) {
      console.error('Error fetching or converting profile picture:', imageError);
      // Only return error if it's a teleuniv.in URL
      if (profileData.picture && profileData.picture.includes('teleuniv.in')) {
        return res.status(500).json({ error: 'Error fetching or converting profile picture' });
      }
    }

    res.json(profileData);
  } catch (apiError) {
    console.error('Error fetching profile data from external API:', apiError);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/userinfo',async(req,res)=>{
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1]; 
  // console.log(token)
  try {
    const response = await axios.post('http://apps.teleuniv.in/api/auth/user-info.php', {}, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Origin': 'http://kmit-netra.teleuniv.in',
        'Referer': 'http://kmit-netra.teleuniv.in/'
      }
    });
    // console.log(response.data);
    const userData = response.data;
    res.json(userData);
    // console.log(userData);
  } catch (apiError) {
    console.error('Error fetching user data from back-end API:', apiError);
    res.status(500).json({ error: 'Internal Server Error' });
}

})

router.post('/attendance', async (req, res) => {
  const { method } = req.body;
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  
    try {
      
      const response = await axios.post('http://apps.teleuniv.in/api/netraapi.php?college=KMIT', {
        method: method,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Origin': 'http://kmit-netra.teleuniv.in',
          'Referer': 'http://kmit-netra.teleuniv.in/'
        }
      });
  
      // console.log(response.data);
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
