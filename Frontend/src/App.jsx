import React from 'react';
import { useState, useEffect } from 'react';
import { Analytics } from "@vercel/analytics/react"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SearchPage from './components/Homepage'; // Import SearchPage
// import OptionsPage from './components/options';
// import Check from './components/check'
import Dashboard from './components/dashboard';
import AttendancePage from './components/AttendancePage';
import ResultPage from './components/ResultPage';
import Timetable from './components/Timetable';
import FeedbackForm from './components/Feedback';
import AboutUs from './AboutUs';

const App = () => {
  const [netraID, setNetraID] = useState(() => {
    
    return localStorage.getItem('netraID') || null;
  });

  useEffect(() => {
    
    localStorage.setItem('netraID', netraID);
  }, [netraID]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<SearchPage setNetraID={ setNetraID} />} /> 
        <Route path="/user" element={<Dashboard netraID={ netraID} />} />
        <Route path="/attendance" element={<AttendancePage netraID={netraID} />} />
        <Route path="/result" element={<ResultPage netraID={netraID} />} />
        <Route path="/timetable" element={<Timetable netraID={netraID} />} />
        <Route path="/feedback" element={<FeedbackForm netraID={netraID} />} />
        <Route path="/aboutus" element={<AboutUs />} />
        {/* <Analytics/> */}
        {/* <Route path="/clubs" element={<Clubdetails />} />  */}
      </Routes>
      </Router>
      
  );
};

export default App;
