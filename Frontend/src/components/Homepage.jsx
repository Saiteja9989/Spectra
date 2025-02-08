import React, { useState } from 'react';
import { Input, Button, Card, Row, Avatar, Col, Space, Typography, Spin } from 'antd';
import axios from 'axios';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../baseurl';
import ScrollingText from './ScrollingText';
const { Text } = Typography;

// const ScrollingText = () => {
//     return (
//         <div style={{
//             overflow: 'hidden',
//             whiteSpace: 'nowrap',
//             background: 'linear-gradient(90deg, #001529, #00284d, #001529)',
//             color: 'white',
//             padding: '10px 0',
//             fontFamily: '"Poppins", sans-serif',
//             width: '100vw',
//             boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
//         }}>
//             <div style={{
//                 display: 'inline-block',
//                 animation: 'scrollText 15s linear infinite',
//                 fontSize: '1rem',
//                 fontWeight: 'bold',
//                 letterSpacing: '0.5px',
//                 minWidth: '100%',
//             }}>
//                 If your profile or name is not found in the search, we recommend registering on Spectra (especially for first-year students).
//             </div>
//             <style>
//                 {`
//                     @keyframes scrollText {
//                         from { transform: translateX(100%); }
//                         to { transform: translateX(-100%); }
//                     }

//                     @media screen and (max-width: 768px) {
//                         div {
//                             font-size: 0.9rem;
//                             animation-duration: 20s;
//                         }
//                     }
//                 `}
//             </style>
//         </div>
//     );
// };

const UserInputPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchType, setSearchType] = useState(null);
    const [loading, setLoading] = useState(false);
    const [source, setSource] = useState(null);
    const navigate = useNavigate();

    const handleInputChange = async (e) => {
        const inputValue = e.target.value.toUpperCase();
        setSearchQuery(inputValue);

        if (!inputValue) {
            setSearchResults([]);
            return;
        }

        if (source) {
            source.cancel('Operation canceled due to new input.');
        }

        const cancelToken = axios.CancelToken;
        const newSource = cancelToken.source();
        setSource(newSource);

        determineSearchType(inputValue, newSource);
    };

    const determineSearchType = async (inputValue, cancelTokenSource) => {
        if (/^\d{10}$/.test(inputValue)) {
            setSearchType('phone');
        } else if (/^\d{1,9}$/.test(inputValue)) {
            setSearchType('partialPhone');
        } else if (/^2[a-zA-Z0-9]+$/.test(inputValue)) {
            setSearchType('hallticketno');
        } else {
            setSearchType('name');
        }
        await fetchResults(inputValue, cancelTokenSource);
    };

    const fetchResults = async (inputValue, cancelTokenSource) => {
        try {
            setLoading(true);
            const response = await axios.post(`${baseUrl}/api/search`, { searchInput: inputValue }, { cancelToken: cancelTokenSource.token });
            setSearchResults(response.data);
        } catch (error) {
            if (axios.isCancel(error)) {
                console.log('Request canceled:', error.message);
            } else {
                console.error('Error fetching search results:', error);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResultClick = async (result) => {
        const resultText = getResultText(result).trim();
        setSearchQuery(resultText);
        try {
            const response = await axios.post(`${baseUrl}/api/def-token`, {
                id: result._id
            });
            if (response.data.success !== 1) {
                showPasswordPrompt(result);
            } else {
                Cookies.set('token', response.data.token, { expires: 7, sameSite: 'strict' });
                fetchUserInfo(response.data.token, result._id);
            }
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    const showPasswordPrompt = (result) => {
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
                        id: result._id,
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
                console.log(result);
                if (result.value && result.value.token) {
                    localStorage.setItem('cookie', result.value.token);
                    Cookies.set('token', result.value.token, { expires: 7, sameSite: 'strict' });
                    fetchUserInfo(result.value.token, result._id);
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

    const fetchUserInfo = async (token, id) => {
        console.log("fetching response:");
        try {
            const response = await axios.post(`${baseUrl}/api/userinfo`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data) {
                console.log(response.data)
                const { rollno } = response.data;
                console.log(rollno);
                localStorage.setItem('rollno', rollno);
                Cookies.set('rollno', rollno, { expires: 7, sameSite: 'strict' });
                console.log("nooooo");
                navigate('/user'); // Navigate immediately to /user
                setTimeout(() => {
                    Swal.fire({
                        title: 'Remember This?',
                        text: 'Do you want to remember this Name/ph.no/rollno for future visits?',
                        icon: 'question',
                        showCancelButton: true,
                        confirmButtonText: 'Yes',
                        cancelButtonText: 'No',
                    }).then((result1) => {
                        if (result1.isConfirmed) {
                            localStorage.setItem('_id', id);
                        }
                    });
                }, 200);
            } else {
                console.log("emo");
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

    const getAvatar = (result) => {
        return (
            <Avatar
                style={{ backgroundColor: '#1890ff', verticalAlign: 'middle' }}
                size="small" // Smaller avatar
            >
                {getResultText(result).charAt(0)}
            </Avatar>
        );
    };

    const getResultText = (result) => {
        switch (searchType) {
            case 'name':
                return `${result.firstname}`;
            case 'hallticketno':
                return `${result.hallticketno}`;
            case 'phone':
                return `${result.phone}`;
            case 'partialPhone':
                return `${result.phone}`;
            default:
                return '';
        }
    };

    return (
        <div>
            <ScrollingText />
            <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
                <Row justify="center" style={{ marginBottom: '2rem' }}>
                    <Col span={24} style={{ textAlign: 'center' }}>
                        <Text strong style={{ fontSize: '2.5rem', fontFamily: '"Poppins", sans-serif', color: '#001529' }}>Welcome to Kmit SPECTRA</Text>
                    </Col>
                    <Col span={24} style={{ textAlign: 'center' }}>
                        <Text type="secondary" style={{ fontSize: '1.2rem', fontFamily: '"Poppins", sans-serif', color: '#595959' }}>Access Your Academic Profile, Attendance, Results....!</Text>
                    </Col>
                </Row>
<Row justify="center" style={{ marginTop: '20px' }}>
    <Col span={24} style={{ textAlign: 'center' }}>
        <Input.Search
            value={searchQuery}
            onChange={handleInputChange}
            placeholder="Enter Name, HallTicket No, or Phone No."
            enterButton
            size="large"
            style={{
                width: '100%',
                borderRadius: '10px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                border: '1px solid #d9d9d9',
                transition: 'all 0.3s ease-in-out',
            }}
        />
    </Col>
    <Col span={24} style={{ display: 'flex', justifyContent: 'center', marginTop: '15px' }}>
        <Text style={{ color: '#ff4d4f', fontSize: '1rem', fontWeight: '400' }}>Name not found?</Text>
        <Button
            type="primary"
            style={{
                borderRadius: '10px',
                backgroundColor: '#1677ff',
                borderColor: '#1677ff',
                color: 'white',
                fontWeight: '500',
                marginLeft: '10px',
                padding: '6px 15px',
                transition: 'all 0.3s ease',
            }}
            onClick={() => navigate('/register')}
        >
            Register Now
        </Button>
    </Col>
</Row>

                {loading && (
                    <Row justify="center" style={{ marginTop: '2rem' }}>
                        <Col span={24} style={{ textAlign: 'center' }}>
                            <Spin size="large" />
                        </Col>
                    </Row>
                )}
                {!loading && searchQuery && (
                    <Row justify="center" style={{ marginTop: '2rem' }}>
                        <Col span={24}>
                            <Space direction="vertical" style={{ width: '100%' }}>
                                {searchResults.slice(0, 5).map((result, index) => (
                                    <Card
                                        key={index}
                                        style={{ 
                                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', 
                                            marginBottom: '0.5rem', 
                                            borderRadius: '8px', 
                                            cursor: 'pointer', 
                                            transition: 'transform 0.2s, box-shadow 0.2s',
                                            padding: '2px 8px', // Compact padding
                                            width: '100%',
                                        }}
                                        onClick={() => handleResultClick(result)}
                                        hoverable
                                    >
                                        <Card.Meta
                                            avatar={getAvatar(result)}
                                            title={
                                                <Text strong style={{ fontSize: '0.7rem' }}> {/* Smaller font size */}
                                                    {getResultText(result)}
                                                </Text>
                                            }
                                            description={
                                                <Text type="secondary" style={{ fontSize: '0.8rem' }}> {/* Smaller font size */}
                                                    CURRENT YEAR: {result.currentyear}
                                                </Text>
                                            }
                                        />
                                    </Card>
                                ))}
                                {searchResults.length > 5 && (
                                    <Text type="secondary" style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem' }}>
                                        Showing top 5 results. Refine your search to see more.
                                    </Text>
                                )}
                            </Space>
                        </Col>
                    </Row>
                )}
            </div>
        </div>
    );
};

export default UserInputPage;