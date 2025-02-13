import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SearchPage from './components/Homepage';
import Dashboard from './components/dashboard';
import AttendancePage from './components/AttendancePage';
import ResultPage from './components/ResultPage';
import Timetable from './components/Timetable';
import FeedbackForm from './components/Feedback';
import AboutUs from './AboutUs';
import Netraqr from './components/Netraqr';
import Register from './components/Register';
import ReactGA from 'react-ga';
import Cookies from 'js-cookie'; 
import AuthHandler from './components/AuthHandler';

ReactGA.initialize('G-8TEK79JG7J');

const App = () => {
    const [token, setToken] = useState(Cookies.get('token') || null);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<AuthHandler setToken={setToken} />} />
                <Route path="/search" element={<SearchPage token={token} />} />
                <Route path="/user" element={<Dashboard  /> } />
                <Route path="/attendance" element={<AttendancePage token={token} />} />
                <Route path="/result" element={<ResultPage token={token} />} />
                <Route path="/timetable" element={<Timetable token={token} />} />
                <Route path="/feedback" element={<FeedbackForm token={token} />} />
                <Route path="/aboutus" element={<AboutUs />} />
                <Route path="/netraqr" element={<Netraqr token={token} />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<SearchPage />} /> 
            </Routes>
        </Router>
    );
};

export default App;
