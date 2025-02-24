import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4'; // Import react-ga4
import SearchPage from './components/Homepage';
import Dashboard from './components/dashboard';
import AttendancePage from './components/AttendancePage';
import ResultPage from './components/ResultPage';
import Timetable from './components/Timetable';
import FeedbackForm from './components/Feedback';
import AboutUs from './AboutUs';
import Netraqr from './components/Netraqr';
import Cookies from 'js-cookie';
import axios from 'axios';
import { baseUrl } from './baseurl';
import Register from './components/Register';

// Initialize Google Analytics with your Measurement ID
ReactGA.initialize('G-8C7K643WQB');

const App = () => {
  const [token, setToken] = useState(Cookies.get('token') || null);
  const [loading, setLoading] = useState(true);
  const location = useLocation(); // Track page views

  // Track page views on route change
  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: location.pathname });
  }, [location]);

  // Track custom events (optional)
  useEffect(() => {
    ReactGA.event({
      category: 'User',
      action: 'Loaded App',
      label: 'App Loaded',
    });
  }, []);

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = Cookies.get('token');

      if (storedToken) {
        setToken(storedToken);
      } else {
        setToken(null);
      }
      setLoading(false);
    };

    fetchToken();
  }, []);

  const RenderComponent = () => {
    if (loading) {
      return <div>Loading...</div>;
    }

    if (token) {
      return <Dashboard token={token} />;
    } else {
      return <Navigate to="/search" />;
    }
  };

  return (
    <Routes>
      <Route path="/" element={<RenderComponent />} />
      <Route path="/search" element={<SearchPage token={token} />} />
      <Route path="/user" element={token ? <Dashboard token={token} /> : <Navigate to="/search" />} />
      <Route path="/attendance" element={<AttendancePage token={token} />} />
      <Route path="/result" element={<ResultPage token={token} />} />
      <Route path="/timetable" element={<Timetable token={token} />} />
      <Route path="/feedback" element={<FeedbackForm token={token} />} />
      <Route path="/aboutus" element={<AboutUs />} />
      <Route path="/netraqr" element={<Netraqr token={token} />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
};

const AppWrapper = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

export default AppWrapper;