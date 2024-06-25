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
import Cookies from 'js-cookie'; 
import axios from 'axios';
import { baseUrl } from './baseurl';
import Swal from 'sweetalert2';
import Loader from './components/Loader';

ReactGA.initialize('G-8TEK79JG7J');

const App = () => {
    const [token, setToken] = useState(null); 
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedToken = Cookies.get('token');
        if (storedToken) {
            setToken(storedToken);
            setIsLoading(false);
        } else {
            const storedPassword = localStorage.getItem('password');
            const storedphnumber = localStorage.getItem('phnumber');
            if (storedPassword && storedphnumber) {
                handleLogin(storedphnumber, storedPassword);
            } else {
                setIsLoading(false);
            }
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
                    Swal.showValidationMessage(
                        `Login failed: ${error}`
                    );
                }
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
            if (result.isConfirmed) {
                if (result.value && result.value.token) {
                    Cookies.set('token', result.value.token, { expires: 7, sameSite: 'strict' });
                    setToken(result.value.token);
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

    const handleLogin = async (mobileNumber, password) => {
        try {
            const response = await axios.post(`${baseUrl}/api/get-token`, {
                mobileNumber: mobileNumber,
                password: password
            });

            if (response.data.token) {
                Cookies.set('token', response.data.token, { expires: 7, sameSite: 'strict' });
                setToken(response.data.token);
                fetchUserInfo(response.data.token);
            } else {
                showPasswordPrompt(mobileNumber);
            }
        } catch (error) {
            console.error('Error logging in:', error);
            showPasswordPrompt(mobileNumber);
        } finally {
            setIsLoading(false);
        }
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

    if (isLoading) {
        return <Loader />;
    }

    return (
        <Router>
            <Routes>
                <Route path="/" element={token ? <Dashboard token={token} /> : <SearchPage token={token} />} />
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
