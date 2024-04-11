import React, { useState } from 'react';
import { Input, Card, Row, Avatar, Col, Space, Typography, Spin } from 'antd'; // Import Spin component
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../baseurl';

const { Text } = Typography;

function UserInputPage({ setNetraID }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchType, setSearchType] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  let timer;

  const handleInputChange = (e) => {
    const inputValue = e.target.value.toUpperCase();
    setSearchQuery(inputValue);

    if (!inputValue) {
      setSearchResults([]);
      return;
    }

    clearTimeout(timer);
    setLoading(true);

    timer = setTimeout(async () => {
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
      setLoading(false);
    }, 0);
  };

  const fetchResults = async (inputValue) => {
    try {
      const response = await axios.post(`${baseUrl}/api/search`, { searchInput: inputValue });
      setSearchResults(response.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const handleSearch = async (key) => {
    try {
      const response = await axios.post(`${baseUrl}/api/netra-id`, {
        searchType: searchType,
        searchValue: key
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
    }
  };

  const handleResultClick = (result) => {
    setSearchQuery(getResultText(result).trim());
    handleSearch(getResultText(result).trim());
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
      <Row justify="center" style={{ marginTop: '2rem' }}>
        <Spin spinning={loading} size="large" /> {/* Use Spin component */}
      </Row>
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
