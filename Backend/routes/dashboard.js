const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const  StudentDetail=require('../models/studentDetails');
const router = express.Router();


router.use(bodyParser.json());
router.post('/profile', async (req, res) => {
const { method, rollno } = req.body;

  try {
    const response = await axios.post('http://teleuniv.in/netra/api.php', {
      method: method,
      rollno: rollno
    });
    const profileData = response.data;
    try{
      const student = await StudentDetail.findOne({ hallticketno: profileData.hallticketno});
      profileData.psflag=student.psflag;
    }
    catch(error){
      console.error('Error fetching profile views from external database:', error);
    }
    const imageResponse = await axios.get(profileData.picture, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(imageResponse.data, 'binary');
    profileData.picture = imageBuffer.toString('base64');
    res.json(profileData);
  } catch (error) {
    console.error('Error fetching profile data from external API:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/attendance', async (req, res) => {
    const { netraID } = req.body;
  
    try {
      
      const response = await axios.post('http://teleuniv.in/netra/api.php', {
        method: '314',
        rollno: netraID
      });
  
      
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
