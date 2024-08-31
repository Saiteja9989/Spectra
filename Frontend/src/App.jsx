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
import axios from 'axios';
import { baseUrl } from './baseurl';
import Swal from 'sweetalert2';

ReactGA.initialize('G-8TEK79JG7J');

const App = () => {
    const [token, setToken] = useState(null); 
    const [password, setPassword] = useState('');
    const [phnumber, setphnumber] = useState('');

    useEffect(() => {
        const storedPassword = localStorage.getItem('password');
        const storedphnumber = localStorage.getItem('phnumber');
        if (storedPassword) {
            setPassword(storedPassword);
            setphnumber(storedphnumber);
        }
    }, []);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
        }
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
                    localStorage.setItem('token', result.value.token);
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
                localStorage.setItem('rollno', rollno);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Failed to Retrieve User Info',
                    text: 'Could not fetch user information from Netra API.',
                });
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
        if (!storedPassword) {
            return false;
        } else {
            try {
                const response = await axios.post(`${baseUrl}/api/get-token`, {
                    mobileNumber: phnumber,
                    password: storedPassword
                });

                if (response.data.message === "Invalid Password!") {
                    showPasswordPrompt(phnumber);
                } else {
                    localStorage.setItem('token', response.data.token);
                    fetchUserInfo(response.data.token);
                }
            } catch (error) {
                console.error('Error logging in:', error);
            }
            return true;
        }
    };

    const renderComponent = async () => {
        const isDashboard = await renderDashboard();
        if (!isDashboard) {
            return <SearchPage token={token} />;
        } else {
            const storedToken = localStorage.getItem('token');
            return <Dashboard token={storedToken} />;
        }
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={renderComponent()} />
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
