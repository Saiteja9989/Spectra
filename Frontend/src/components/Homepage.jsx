import React, { useState } from 'react';
import { Input, List, Avatar, Typography, Row, Col, Card, Button, Space } from 'antd';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { customErrorCloseStyle, customToastStyle, customErrorIconStyle } from './toast';

const { Text } = Typography;

function UserInputPage({ setNetraID }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchType, setSearchType] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = async (e) => {
    const inputValue = e.target.value.toUpperCase();
    setSearchQuery(inputValue);

    if (!inputValue) {
      setSearchResults([]);
      return;
    }

    if (/^\d{10}$/.test(inputValue)) {
      setSearchType('phone');
      await fetchResults(inputValue);
    } else if (/^\d{1,9}$/.test(inputValue)) {
      setSearchType('partialPhone');
      await fetchResults(inputValue);
    } else if (/^2[a-zA-Z0-9]+$/.test(inputValue)) {
      setSearchType('hallticketno');
      await fetchResults(inputValue);
    } else {
      setSearchType('name');
      await fetchResults(inputValue);
    }
  };

  const fetchResults = async (inputValue) => {
    try {
      const response = await axios.post('http://localhost:5000/api/search', { searchInput: inputValue });
      setSearchResults(response.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/netra-id', {
        searchType: searchType,
        searchValue: searchQuery
      });
      setNetraID(response.data);
      if (response.data) {
        navigate('/user');
      } else {
        toast.error('Not a valid phone number, hall ticket number, or name.', {
          style: customToastStyle,
          icon: (
            <div style={customErrorIconStyle}>
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm2-13h-4v8h4V7zm-1 5h-2v-2h2v2z" />
              </svg>
            </div>
          ),
          closeButton: (
            <div style={customErrorCloseStyle}>
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 1L1 12h3v10h14V12h3L12 1zm5 11l-1.41 1.41L12 13.41l-3.59 3.59L7 12.59 10.599 7 5.41 8.41 4 12 7.59 15.59 4 19 5.41 17.41 9 19 12.59 17.41 16 19 18.59 15.59 22 12 19.41 8.41 22 7 18.59z" />
              </svg>
            </div>
          ),
          closeButtonClassName: 'error__close',
        });
      }
    } catch (error) {
      console.error('Error fetching Netra ID:', error);
    }
  };

  const handleResultClick = (result) => {
    setSearchQuery(getResultText(result).trim());
    setSearchResults([]);
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
      <ToastContainer position="top-center" />
      <Row justify="center" style={{ marginBottom: '2rem' }}>
        <Col span={24} style={{ textAlign: 'center' }}>
          <Text strong style={{ fontSize: '2rem' }}>Welcome to KMIT Student Portal</Text>
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
      {searchQuery && (
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
