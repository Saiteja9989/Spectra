import React, { useState, useEffect } from 'react';
import { Table, Progress, Button } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LeftOutlined } from '@ant-design/icons';
import Cookies from 'js-cookie';
import Loader from './Loader'; 
import Navbar from './Navbar';
import { baseUrl } from '../baseurl';
import './AttendancePage.css';

const AttendancePage = () => {
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve token from cookies
    const storedToken = Cookies.get('token');
    if (storedToken) {
      setToken(storedToken);
      fetchAttendanceData(storedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchAttendanceData(token);
    }
  }, [token]);

  const fetchAttendanceData = async (token) => {
    setLoading(true); 
    try {
      const response = await axios.post(`${baseUrl}/api/subject/attendance`, {
        method: "314"
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = response.data;
      setAttendanceData(data);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    } finally {
      setLoading(false); 
    }
  };

  const handleBackButtonClick = () => {
    navigate('/user');
  };

  const columns = [
    {
      title: 'Subject',
      dataIndex: 'subjectname',
      key: 'subjectname',
      width: '30%', 
    },
    {
      title: 'Theory (%)',
      dataIndex: 'percentage',
      key: 'percentage',
      render: (percentage) => {
        const percentValue = percentage === '--' ? 0 : parseFloat(percentage).toFixed(1);
        const color = percentage === '100' || percentage === '--' ? '#137512' : null;
        return <Progress percent={percentValue} size="small" style={{ width: '80px' }} strokeColor={color} />;
      },
    },
    {
      title: 'Practicals (%)',
      dataIndex: 'practical',
      key: 'practical',
      render: (practical) => {
        const percentValue = practical === '--' ? 0 : parseFloat(practical).toFixed(1);
        const color = practical === '100' || practical === '--' ? '#137512' : null;
        return <Progress percent={percentValue} size="small" style={{ width: '80px' }} strokeColor={color} />;
      },
    },
  ];

  return (
    <>
      <Navbar /> 
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
        <Button
          type="link"
          icon={<LeftOutlined />}
          onClick={handleBackButtonClick}
          style={{ marginBottom: '20px' }}
        >
          Back
        </Button>
        <div style={{ flex: '1' }}>
          {loading ? (
            <Loader />
          ) : (
            <Table
              dataSource={attendanceData}
              columns={columns}
              bordered
              size="small"
              pagination={false}
              rowKey="subjectname"
            />
          )}
        </div>
      </div>
    </>
  );
};

export default AttendancePage;
