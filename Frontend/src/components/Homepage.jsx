import React, { useState, useEffect } from 'react';
import { Input, Card, Row, Avatar, Col, Space, Typography, Spin } from 'antd';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../baseurl';

const { Text } = Typography;

function UserInputPage({ setNetraID, netraID2}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchType, setSearchType] = useState(null);
  const [loading, setLoading] = useState(false); 
  const [source, setSource] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    const lastInput = getLastInput();
    if (lastInput) {
      setSearchQuery(lastInput.value);
      setSearchType(lastInput.type);
      fetchResults(lastInput.value);
    } else {
      setSearchResults([]);
      showRememberMePrompt();
    }
    
    return () => {
      if (source) {
        source.cancel('Operation canceled by cleanup.');
      }
    };
  }, []);

  const showRememberMePrompt = () => {
    Swal.fire({
      title: 'Remember Me',
      text: 'Would you like us to remember your search query for future visits?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        rememberInput(searchQuery, searchType);
      }
    });
  };

  const rememberInput = (input, type) => {
    localStorage.setItem('lastInput', JSON.stringify({ value: input, type: type }));
  };

  const getLastInput = () => {
    try {
      const lastInput = localStorage.getItem('lastInput');
      return lastInput ? JSON.parse(lastInput) : null;
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return null;
    }
  };

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

    if (/^\d{10}$/.test(inputValue)) {
      setSearchType('phone');
      await fetchResults(inputValue, newSource);
    } else if (/^\d{1,9}$/.test(inputValue)) {
      setSearchType('partialPhone');
      await fetchResults(inputValue, newSource);
    } else if (/^2[a-zA-Z0-9]+$/.test(inputValue)) {
      setSearchType('hallticketno');
      await fetchResults(inputValue, newSource);
    } else {
      setSearchType('name');
      await fetchResults(inputValue, newSource);
    }
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

  const handleSearch = async (key) => {
    try {
      setLoading(true); 
      const response = await axios.post(`${baseUrl}/api/netra-id`, {
        searchType: searchType,
        searchValue: key,
        netraID2:netraID2
      });
      setNetraID(response.data);
      if (response.data) {
        navigate('/user');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Not a valid phone number, hall ticket number, or name.',
        });
      }
    } catch (error) {
      console.error('Error fetching Netra ID:', error);
    } finally {
      setLoading(false); 
    }
  };

  const handleResultClick = (result) => {
    const resultText = getResultText(result).trim();
    setSearchQuery(resultText);
    handleSearch(resultText);
    setSearchResults([]);
  
    Swal.fire({
      title: 'Remember This?',
      text: 'Do you want to remember this Name/ph.no/rollno for future visits?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        rememberInput(resultText, searchType);
      }
    });
  };
  

  const getAvatar = (result) => {
    if (getResultText(result)) {
      return (
        <Avatar.Group>
          <Avatar
            style={{ backgroundColor: 'grey', verticalAlign: 'middle' }}
            icon={<Avatar />}
          >
            {getResultText(result).charAt(0)}
          </Avatar>
        </Avatar.Group>
      );
    }
    return <Avatar src="https://joeschmoe.io/api/v1/random" />;
  };

  const getResultText = (result) => {
    switch (searchType) {
      case 'name':
        return ` ${result.firstname}`;
      case 'hallticketno':
        return ` ${result.hallticketno}`;
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
            onSearch={handleSearch}
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
                  />
                </Card>
              ))}
            </Space>
          </Col>
        </Row>
      )}
    </div>
  );
}

export default UserInputPage;
