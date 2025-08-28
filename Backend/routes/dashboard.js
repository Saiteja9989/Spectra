const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const StudentDetail = require('../models/studentDetails');
const jwt = require('jsonwebtoken');
const router = express.Router();


router.use(bodyParser.json());
router.post("/studentprofile", async (req, res) => {
  const { studentId } = req.body;
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(400).json({ error: "Token missing" });
  if (!studentId) return res.status(400).json({ error: "Student ID missing" });

  try {
    const response = await axios.get(
      `https://kmit-api.teleuniv.in/studentmaster/studentprofile/${studentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Origin: "https://kmit.teleuniv.in",
          Referer: "https://kmit.teleuniv.in/",
        },
      }
    );

    const data = response.data;

    if (data.Error) {
      return res.status(400).json({ error: "College API returned an error" });
    }

    // Send student and QR code separately
    res.json({
  payload: {
    student: data.payload.student,
    studentimage: data.payload.studentimage, // include if you have it
    qrcode: data.payload.qrcode,
  }
});
  } catch (error) {
    console.error("Error in proxy to college API:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



function decodeJwt(token) {
  const payloadBase64 = token.split('.')[1];
  const payloadJson = Buffer.from(payloadBase64, 'base64').toString('utf8');
  return JSON.parse(payloadJson);
}

router.post("/userinfo", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1] || req.cookies.token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    // Decode token to get studentId
    const decoded = decodeJwt(token);
    const studentId = decoded.sub; // assuming studentId is in "sub"

    if (!studentId) return res.status(400).json({ error: "Student ID not found in token" });

    // Call college API
    const response = await axios.get(
      `https://kmit-api.teleuniv.in/studentmaster/studentprofile/${studentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Origin: 'https://kmit.teleuniv.in',
          Referer: 'https://kmit.teleuniv.in/',
        },
        timeout: 10000
      }
    );
    //  console.log(response.data)
    res.json(response.data);

  } catch (error) {
    console.error("Error fetching user info:", error.message || error);
    res.status(500).json({ error: "Failed to fetch user information" });
  }
});


router.post('/attendance', async (req, res) => {
  // const { method, tar } = req.body;
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  
  try {
    // Call the new attendance API
    const response = await axios.get('https://kmit-api.teleuniv.in/sanjaya/getAttendance', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Origin': 'https://kmit.teleuniv.in',
        'Referer': 'https://kmit.teleuniv.in/'
      }
    });
    

    // Process the new response structure to match the old format
    const { payload } = response.data;
    
    const attendanceDetails = payload?.attendanceDetails || [];
    const totalPercentage = payload?.overallAttendance || "0";

    // Convert to dayobjects format
    const dayObjects = attendanceDetails.map(day => ({
      date: day.date,
      sessions: day.periods.reduce((sessions, period) => {
        sessions[`period_${period.period_no}`] = period.status;
        return sessions;
      }, {})
    }));

    // Calculate twoWeekSessions counts
    const twoWeekSessions = {
      present: 0,
      absent: 0,
      nosessions: 0
    };

    attendanceDetails.forEach(day => {
      day.periods.forEach(period => {
        if (period.status === 1) twoWeekSessions.present++;
        else if (period.status === 0) twoWeekSessions.absent++;
        else twoWeekSessions.nosessions++;
      });
    });

    // Create response matching old format
    const attendanceData = {
      dayObjects,
      totalPercentage,
      twoWeekSessions
    };

    // Maintain the special case handling (if needed)
    

    res.json(attendanceData);
  } catch (error) {
    console.error('Error fetching attendance data from external API:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
  




module.exports = router;