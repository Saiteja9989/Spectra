import React from 'react';
import { useState, useEffect } from 'react';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SearchPage from './components/Homepage'; // Import SearchPage
// import OptionsPage from './components/options';
// import Check from './components/check'
import Dashboard from './components/dashboard';
import AttendancePage from './components/AttendancePage';

const App = () => {
  const [netraID, setNetraID] = useState(null);
  // const [profileDetails, setProfileDetails] = useState(null);
  // const [attendanceData, setAttendanceData] = useState(null);

  // useEffect(() => {
  //   if (netraID) {
  //     fetchProfileData(netraID);
  //   }
  // }, [netraID]);

  // const fetchProfileData = async (netraID) => {
  //   try {
  //     const response = await axios.post('http://teleuniv.in/netra/api.php', {
  //       method: '32',
  //       rollno: netraID
  //     });
  //     const data = response.data;
  //     console.log(data)
  //     // setProfileDetails(data.profileDetails);
    
  //     // setAttendanceData(data.attendanceData);
  //   } catch (error) {
  //     console.error('Error fetching profile data:', error);
  //   }
  // };

  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SearchPage setNetraID={ setNetraID} />} /> 
        {/* <Route path="/check" element={<Check netraID={ netraID} />} /> */}
        {/* <Route path="/options" element={<OptionsPage />} /> */}
        <Route path="/user" element={<Dashboard netraID={ netraID} />} />
        <Route path="/attendance" element={<AttendancePage netraID={netraID} />} />
      </Routes>
      </Router>
      
  );
};

export default App;
