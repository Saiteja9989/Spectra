import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SearchPage from './components/Homepage';
import Dashboard from './components/dashboard';
import AttendancePage from './components/AttendancePage';
import ResultPage from './components/ResultPage';
import Timetable from './components/Timetable';
import FeedbackForm from './components/Feedback';
import AboutUs from './AboutUs';
import Netraqr from './components/Netraqr';
import ReactGA from 'react-ga';
import Cookies from 'js-cookie'; // Import js-cookie for cookie management

ReactGA.initialize('G-8TEK79JG7J');

const App = () => {
    const [token, setToken] = useState(null); // State to hold token

    useEffect(() => {
        // Retrieve token from cookie when component mounts
        const storedToken = Cookies.get('token');
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Dashboard token={token} />} />
                <Route path="/search" element={<SearchPage token={token} />} />
                <Route path="/user" element={<Dashboard token={token} />} />
                <Route path="/attendance" element={<AttendancePage token={token} />} />
                <Route path="/result" element={<ResultPage token={token} />} />
                <Route path="/timetable" element={<Timetable token={token} />} />
                <Route path="/feedback" element={<FeedbackForm token={token} />} />
                <Route path="/aboutus" element={<AboutUs />} />
                <Route path="/netraqr" element={<Netraqr token={token} />} />
            </Routes>
        </Router>
    );
};

export default App;