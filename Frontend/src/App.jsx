import React from 'react';
import { useState, useEffect } from 'react';
import { Analytics } from "@vercel/analytics/react"
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import SearchPage from './components/Homepage'; // Import SearchPage
// import OptionsPage from './components/options';
// import Check from './components/check'
import Dashboard from './components/dashboard';
import AttendancePage from './components/AttendancePage';
import ResultPage from './components/ResultPage';
import Timetable from './components/Timetable';
import FeedbackForm from './components/Feedback';
import AboutUs from './AboutUs';
import Netraqr from './components/Netraqr';
import ReactGA from 'react-ga';
// import Clubdetails from './components/Clubs';
ReactGA.initialize('G-8TEK79JG7J');
const App = () => {
  const [netraID, setNetraID] = useState(() => {
    
    return localStorage.getItem('netraID') || null;
  });
  const [netraID2, setNetraID2] = useState('');

  useEffect(() => {
    const storedNetraID2 = localStorage.getItem('netraID2');
    if (storedNetraID2) {
      setNetraID2(storedNetraID2);
    }
  }, []);
  useEffect(() => {
    ReactGA.pageview(location.pathname + location.search);
  }, [location]);
  const renderDashboard = () => {
    if (netraID2!=='') {
      return <Dashboard netraID={netraID2} />;
    } else {
      return <SearchPage setNetraID={ setNetraID}  />;
    }
  };
  useEffect(() => {
    localStorage.setItem('netraID', netraID);
  }, [netraID]);

 
  return (
    <Router>
      <Routes>
      <Route path="/" element={renderDashboard()} /> 
        <Route path="/search" element={<SearchPage setNetraID={ setNetraID}  />} /> 
        <Route path="/user" element={<Dashboard netraID={ netraID} />} />
        <Route path="/attendance" element={<AttendancePage netraID={netraID} />} />
        <Route path="/result" element={<ResultPage netraID={netraID} />} />
        <Route path="/timetable" element={<Timetable netraID={netraID} />} />
        <Route path="/feedback" element={<FeedbackForm netraID={netraID} />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/netraqr" element={<Netraqr netraID={netraID} />} />

        {/* <Analytics/> */}
        {/* <Route path="/clubs" element={<Clubdetails />} />  */}
      </Routes>
      </Router>
      
  );
};

export default App;
