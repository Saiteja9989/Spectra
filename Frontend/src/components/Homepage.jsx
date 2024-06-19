import React, { useState } from 'react';
import { Input, Card, Row, Avatar, Col, Space, Typography, Spin } from 'antd';
import axios from 'axios';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie'; // Import js-cookie for cookie management
import { useNavigate } from 'react-router-dom'; // Import useHistory for navigation
import { baseUrl } from '../baseurl'; // Assuming you have a baseUrl file

const { Text } = Typography;

const UserInputPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchType, setSearchType] = useState(null);
    const [loading, setLoading] = useState(false);
    const [source, setSource] = useState(null);
    const navigate = useNavigate(); // Initialize useHistory for navigation

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

    const handleResultClick = (result) => {
        const resultText = getResultText(result).trim();
        setSearchQuery(resultText);

        // Retrieve mobile number from result
        const mobileNumber = result.phone; // Adjust according to your result data structure

        // Show password prompt
        showPasswordPrompt(resultText, mobileNumber);
    };

    const showPasswordPrompt = (resultText, mobileNumber) => {
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
            const response = await axios.post('http://teleuniv.in/netra/auth/user-info.php', {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data && response.data.success) {
                const { rollno } = response.data.user;

                // Store rollno in cookies
                Cookies.set('rollno', rollno, { expires: 7, sameSite: 'strict' });

                // Redirect to /user page
                navigate('/user');
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
                    <Text strong style={{ fontSize: '2rem' }}>Welcome to KMIT SPECTRA</Text>
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
                                        description={`Type: ${searchType}`}
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
