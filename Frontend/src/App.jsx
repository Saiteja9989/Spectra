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
        const storedToken = Cookies.get('token');
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
                    // Send API request to get token
                    const response = await axios.post(`${baseUrl}/api/get-token`, {
                        mobileNumber: mobileNumber,
                        password: password
                    });

                    return response.data; // Return response data to handle in then
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
                // Handle successful login response
                if (result.value && result.value.token) {
                    // Store token in cookies upon successful login
                    Cookies.set('token', result.value.token, { expires: 7, sameSite: 'strict' });

                    // Fetch user info and store rollno in cookies
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
 
                 // Store rollno in cookies
                 Cookies.set('rollno', rollno, { expires: 7, sameSite: 'strict' });
 
                 // Redirect to /user page
                 
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
        console.log("hello bhai",password);
        if (password!=='') {
            try {
                const response = await axios.post(`${baseUrl}/api/get-token`, {
                    mobileNumber: phnumber,
                    password: password
                });
                if(response.data.message==="Invalid Password!"){
                    showPasswordPrompt(phnumber);
                }
                else{
                    console.log("cookie undone");
                    Cookies.set('token', response.data.token);
                fetchUserInfo(response.data.token);
                }
                
            } catch (error) {
                console.error('Error logging in:', error);
                
            }
            return 1;
        } else {
            
            return 2;
        }
      };
      const rendercomponent=()=>{
        const emo=renderDashboard();
        if(emo!==1){
            return <Dashboard token={token} />;
        }
        else{
            return <SearchPage token={token}/>;
        }
      }
    return (
        <Router>
            <Routes>
                <Route path="/" element={rendercomponent()} />
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