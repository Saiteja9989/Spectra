const express = require('express');
const axios = require('axios');

const router = express.Router();

router.post('/timetable', async (req, res) => {
  try {
    const { method } = req.body;
    const token = req.headers.authorization.split(' ')[1];

    // Fetch timetable data
    const timetableResponse = await axios.post('http://teleuniv.in/netra/netraapi.php', {
      method: method,
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // Extract timetable data from the API response
    const timetable = timetableResponse.data.timetable;

    // Extract unique subjects from the timetable data
    const uniqueSubjects = extractUniqueSubjects(timetable);

    // Make a request to fetch attendance based on the provided method
    const attendanceResponse = await axios.post('http://teleuniv.in/netra/netraapi.php', {
      method: '314'
    },{
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // Extract attendance data
    const attendanceData = attendanceResponse.data.overallattperformance.overall;

    // Prepare data for each unique subject
    const subjectData = uniqueSubjects.map(subject => {
      // Find the subject in the attendance data
      const subjectAttendance = attendanceData.find(item => item.subjectname === subject);
      if (subjectAttendance) {
        // Extract percentage and practical values
        const percentage = subjectAttendance.percentage === '--' ? subjectAttendance.practical : subjectAttendance.percentage;
        return { subject, percentage };
      } else {
        // Subject not found in attendance data
        return { subject, percentage: null };
      }
    });

    // Send the subject data as a response
    res.json({ subjectData });
  } catch (error) {
    console.error('Error fetching timetable or attendance:', error);
    res.status(500).json({ error: 'Error fetching timetable or attendance' });
  }
});

// Function to extract unique subjects from the timetable data
function extractUniqueSubjects(timetable) {
  // Check if timetable is null or empty
  if (!timetable || timetable.length === 0) {
    return [];
  }

  const uniqueSubjects = new Set();
  timetable.forEach(day => {
    // Check if day contains sessions before accessing properties
    if (day && day.beforelunch) {
      day.beforelunch.forEach(session => {
        // Check if session contains subject before accessing property
        if (session && session.subject) {
          uniqueSubjects.add(session.subject);
        }
      });
    }

    // Check if day contains sessions after lunch before accessing properties
    if (day && day.afterlunch) {
      day.afterlunch.forEach(session => {
        // Check if session contains subject before accessing property
        if (session && session.subject) {
          uniqueSubjects.add(session.subject);
        }
      });
    }
  });
  return Array.from(uniqueSubjects);
}

module.exports = router;
