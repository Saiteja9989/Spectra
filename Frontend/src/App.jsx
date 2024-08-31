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
    const [password, setPassword] = useState('');
    const [phnumber, setPhnumber] = useState('');

    useEffect(() => {
        const fetchToken = async () => {
            const storedToken = Cookies.get('token');
            if (storedToken) {
                setToken(storedToken);
                setLoading(false);
                return;
            }

            const storedPassword = localStorage.getItem('password');
            const storedPhnumber = localStorage.getItem('phnumber');
            if (storedPassword && storedPhnumber) {
                setPassword(storedPassword);
                setPhnumber(storedPhnumber);
                
                try {
                    const response = await axios.post(`${baseUrl}/api/get-token`, {
                        mobileNumber: storedPhnumber,
                        password: storedPassword
                    });

                    if (response.data.token) {
                        Cookies.set('token', response.data.token, { expires: 7, sameSite: 'strict' });
                        setToken(response.data.token);
                    }
                } catch (error) {
                    console.error('Error fetching token:', error);
                }
            }
            setLoading(false);
        };

        fetchToken();
    }, []);

    const showPasswordPrompt = (mobileNumber) => {
        Swal.fire({
            title: 'Enter KMIT Netra Password',
            input: 'password',
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Submit',
            showLoaderOnConfirm: true,
            preConfirm: async (password) => {
                try {
                    const response = await axios.post(`${baseUrl}/api/get-token`, {
                        mobileNumber: mobileNumber,
                        password: password
                    });

                    return response.data;
                } catch (error) {
                    console.error('Error logging in:', error);
                    Swal.showValidationMessage(`Login failed: ${error}`);
                }
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
            if (result.isConfirmed) {
                if (result.value && result.value.token) {
                    Cookies.set('token', result.value.token, { expires: 7, sameSite: 'strict' });
                    localStorage.setItem('cookie', result.value.token);
                    fetchUserInfo(result.value.token);
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Invalid Token',
                        text: 'Failed to retrieve valid token from Netra API.',
                    });
                }
            }
        });
    };

    const fetchUserInfo = async (token) => {
        try {
            const response = await axios.post(`${baseUrl}/api/userinfo`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data && response.data.success) {
                const { rollno } = response.data.user;
                Cookies.set('rollno', rollno, { expires: 7, sameSite: 'strict' });
            } else {
                // Optionally handle user info fetch failure
            }
        } catch (error) {
            console.error('Error fetching user info:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to fetch user information.',
            });
        }
    };

    const renderDashboard = async () => {
        const storedPassword = localStorage.getItem('password');
        const storedNumber = localStorage.getItem('phnumber');
        if (!storedPassword || !storedNumber) {
            return false;
        } else {
            try {
                const response = await axios.post(`${baseUrl}/api/get-token`, {
                    mobileNumber: storedNumber,
                    password: storedPassword
                });

                if (response.data.message === "Invalid Password!") {
                    showPasswordPrompt(phnumber);
                } else {
                    localStorage.setItem('cookie', response.data.token);
                    Cookies.set('token', response.data.token, { expires: 7, sameSite: 'strict' });
                    fetchUserInfo(response.data.token);
                }
            } catch (error) {
                console.error('Error logging in:', error);
            }
            return true;
        }
    };

    const RenderComponent = () => {
        if (loading) {
            return <div>Loading...</div>;
        }
        if (token && renderDashboard()) {
            return <Dashboard token={token} />;
        } else {
            return <SearchPage token={token} />;
        }
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={<RenderComponent/>} />
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
