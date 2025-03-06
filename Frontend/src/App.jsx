import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import ReactGA from "react-ga4";
import SearchPage from "./components/Homepage";
import Dashboard from "./components/dashboard";
import AttendancePage from "./components/AttendancePage";
import ResultPage from "./components/ResultPage";
import Timetable from "./components/Timetable";
import FeedbackForm from "./components/Feedback";
import AboutUs from "./AboutUs";
import Netraqr from "./components/Netraqr";
import Cookies from "js-cookie";
import Register from "./components/Register";

// Initialize Google Analytics
ReactGA.initialize("G-8C7K643WQB");

const App = () => {
  const [token, setToken] = useState(Cookies.get("token") || null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Track page views on route change
  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname });
  }, [location]);

  // Track custom events
  useEffect(() => {
    ReactGA.event({
      category: "User",
      action: "Loaded App",
      label: "App Loaded",
    });
  }, []);

  // Fetch token when the app loads and when cookies change
  useEffect(() => {
    const fetchToken = () => {
      const storedToken = Cookies.get("token");
      setToken(storedToken || null);
      setLoading(false);
    };

    fetchToken();
  }, []); // Runs once when the component mounts

  // Watch for token updates in cookies
  useEffect(() => {
    const interval = setInterval(() => {
      const storedToken = Cookies.get("token");
      if (storedToken !== token) {
        setToken(storedToken);
      }
    }, 500); // Check every 500ms

    return () => clearInterval(interval);
  }, [token]);

  return (
    <Routes>
      <Route path="/" element={token ? <Dashboard token={token} /> : <Navigate to="/search" />} />
      <Route path="/search" element={<SearchPage setToken={setToken} />} />
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
