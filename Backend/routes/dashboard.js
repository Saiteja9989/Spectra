const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const router = express.Router();

// Middleware to parse incoming JSON requests
router.use(bodyParser.json());

// Endpoint to handle profile data request
router.post('/profile', async (req, res) => {
  const { method, rollno } = req.body;

  try {
    // Send a request to 'http://teleuniv.in/netra/api.php' with method and rollno
    const response = await axios.post('http://teleuniv.in/netra/api.php', {
      method: method,
      rollno: rollno
    });

    // Assuming the response data contains the profile information
    const profileData = response.data;
    const imageResponse = await axios.get(profileData.picture, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(imageResponse.data, 'binary');

    // Add the base64 encoded image to the profile data
    profileData.picture = imageBuffer.toString('base64');
    // Send the profile data as JSON response
    res.json(profileData);
  } catch (error) {
    // If there's an error in fetching data from the external API
    console.error('Error fetching profile data from external API:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/attendance', async (req, res) => {
    const { netraID } = req.body;
  
    try {
      // Send a request to 'http://teleuniv.in/netra/api.php' with the method and rollno
      const response = await axios.post('http://teleuniv.in/netra/api.php', {
        method: '314',
        rollno: netraID
      });
  
      // Extract the required data from the response
      const { attandance, overallattperformance } = response.data;
      const data = attandance.dayobjects;
      const data1 = overallattperformance.totalpercentage;
      const data2 = attandance.twoweeksessions;
  
      // Prepare the data to be sent to the client
      const attendanceData = {
        dayObjects: data,
        totalPercentage: data1,
        twoWeekSessions: data2
      };
  
      // Send the attendance data as JSON response
      res.json(attendanceData);
    } catch (error) {
      // If there's an error in fetching data from the external API
      console.error('Error fetching attendance data from external API:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

module.exports = router;
