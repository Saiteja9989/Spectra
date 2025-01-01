import React, { useState } from 'react';
import { Input, Card, Row, Avatar, Col, Space, Typography, Spin } from 'antd';
import axios from 'axios';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie'; 
import { useNavigate } from 'react-router-dom'; 
import { baseUrl } from '../baseurl'; 
import Loader from './Loader';

const { Text } = Typography;

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
                id:result._id
            });
            if (response.data.success !== 1) {
                showPasswordPrompt(result);
            } else {
                
                Cookies.set('token', response.data.token, { expires: 7, sameSite: 'strict' });
                fetchUserInfo(response.data.token,result._id);
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
                        id:result._id,
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
                    localStorage.setItem('cookie',result.value.token);
                    Cookies.set('token', result.value.token, { expires: 7, sameSite: 'strict' });
                    fetchUserInfo(result.value.token,result._id);
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

    const fetchUserInfo = async (token,id) => {
        console.log("fetching response:");
        // console.log(token)
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
                localStorage.setItem('rollno',rollno);
                Cookies.set('rollno', rollno, { expires: 7, sameSite: 'strict' });
                console.log("nooooo");
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
                navigate('/user');
             }
              else {
                console.log("emo");
                // Swal.fire({
                //     icon: 'error',
                //     title: 'Failed to Retrieve User Info',
                //     text: 'Could not fetch user information from Netra API.',
                // });
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
                style={{ backgroundColor: 'grey', verticalAlign: 'middle' }}
                icon={<Avatar />}
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
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <Row justify="center" style={{ marginBottom: '2rem' }}>
                <Col span={24} style={{ textAlign: 'center' }}>
                    <Text strong style={{ fontSize: '2rem' }}>Welcome to KMIT SPECTRA 2.0</Text>
                </Col>
                <Col span={24} style={{ textAlign: 'center' }}>
                    <Text type="secondary" style={{ fontSize: '1.1rem' }}>Access Your Academic Profile, Attendance, Results....!</Text>
                </Col>
            </Row>
            <Row justify="center">
                <Col span={24}>
                    <Input.Search
                        value={searchQuery}
                        onChange={handleInputChange}
                        placeholder="Enter Name, HallTicket No, or Phone No."
                        enterButton
                        size="large"
                        style={{ width: '100%' }}
                    />
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
                            {searchResults.map((result, index) => (
                                <Card
                                    key={index}
                                    style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', marginBottom: '1rem' }}
                                    onClick={() => handleResultClick(result)}
                                >
                                    <Card.Meta
                                        avatar={getAvatar(result)}
                                        title={<Text strong>{getResultText(result)}</Text>}
                                        description={`CURRENT YEAR: ${result.currentyear}`}
                                    />
                                </Card>
                            ))}
                        </Space>
                    </Col>
                </Row>
            )}
        </div>
    );
};

export default UserInputPage;
