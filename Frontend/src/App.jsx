import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SearchPage from './components/Homepage';
import Dashboard from './components/dashboard';
import AttendancePage from './components/AttendancePage';
import ResultPage from './components/ResultPage';
import Timetable from './components/Timetable';
import FeedbackForm from './components/Feedback';
import AboutUs from './AboutUs';
import Netraqr from './components/Netraqr';
import ReactGA from 'react-ga';
import Cookies from 'js-cookie'; 
import axios from 'axios';
import { baseUrl } from './baseurl';
import Swal from 'sweetalert2';

ReactGA.initialize('G-8TEK79JG7J');

const App = () => {
    const [token, setToken] = useState(Cookies.get('token') || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchToken = async () => {
            const storedPassword = localStorage.getItem('_id');

            if (storedPassword) {
                if (true) {
                    console.log("hello");
                    try {
                        const response = await axios.post(`${baseUrl}/api/def-token`, {
                            id: storedPassword
                        });

                        if (response.data.token) {
                            Cookies.set('token', response.data.token, { expires: 7, sameSite: 'strict' });
                            localStorage.setItem('cookie', response.data.token);
                            setToken(response.data.token);
                        }
                    } catch (error) {
                        console.error('Error fetching token:', error);
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Failed to generate a new token.',
                        });
                    }
                }
            } else {
                setToken(null);
            }
            setLoading(false);
        };

        fetchToken();
    }, []);

    const RenderComponent = () => {
        const storedPassword = localStorage.getItem('_id');

        if (loading) {
            return <div>Loading...</div>;
        }

        if (storedPassword && token) {
            return <Dashboard token={token} />;
        } else {
            return <Navigate to="/search" />;
        }
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={<RenderComponent />} />
                <Route path="/search" element={<SearchPage token={token} />} />
                <Route path="/user" element={token ? <Dashboard token={token} /> : <Navigate to="/" />} />
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
