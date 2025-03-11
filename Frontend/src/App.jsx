import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
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
import { jwtDecode } from "jwt-decode"; // For decoding JWT tokens

// Initialize Google Analytics
ReactGA.initialize("G-8C7K643WQB");

const App = () => {
  const [token, setToken] = useState(Cookies.get("token") || null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

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

  // Function to check if the token is expired
  const isTokenExpired = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Convert to seconds
      return decodedToken.exp < currentTime; // Check if token is expired
    } catch (error) {
      console.error("Error decoding token:", error);
      return true; // Assume token is invalid if decoding fails
    }
  };

  // Fetch token when the app loads and check its validity
  useEffect(() => {
    const storedToken = Cookies.get("token");
    if (storedToken) {
      if (isTokenExpired(storedToken)) {
        // console.log("Token expired, clearing token and redirecting to login");
        Cookies.remove("token");
        setToken(null);
        navigate("/search"); 
      } else {
        setToken(storedToken);
        // console.log("Token set in state:", storedToken); 
      }
    } else {
      setToken(null);
    }
    setLoading(false);
  }, [navigate]);

  // Periodically check token expiry while the app is running
  useEffect(() => {
    const interval = setInterval(() => {
      const storedToken = Cookies.get("token");
      if (storedToken && isTokenExpired(storedToken)) {
        // console.log("Token expired, clearing token and redirecting to login");
        Cookies.remove("token");
        setToken(null);
        navigate("/search"); // Redirect to login/search page
      }
    }, 60000); // Check every 1 minute

    return () => clearInterval(interval);
  }, [navigate]);

  // Watch for token updates in cookies
  useEffect(() => {
    const interval = setInterval(() => {
      const storedToken = Cookies.get("token");
      if (storedToken !== token) {
        setToken(storedToken);
        // console.log("Token state updated:", storedToken);
      }
    }, 500); // Check every 500ms

    return () => clearInterval(interval);
  }, [token]);

  return (
    <Routes>
      <Route
        path="/"
        element={token ? <Dashboard token={token} /> : <Navigate to="/search" />}
      />
      <Route path="/search" element={<SearchPage setToken={setToken} />} />
      <Route
        path="/user"
        element={token ? <Dashboard token={token} /> : <Navigate to="/search" />}
      />
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