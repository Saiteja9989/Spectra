import React, { useState, useEffect } from 'react';
import { Table, Progress, Button } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LeftOutlined } from '@ant-design/icons';
import Loader from './Loader'; // Import the Loader component
import Navbar from './Navbar';

const AttendancePage = ({ netraID }) => {
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();

  useEffect(() => {
    if (netraID) {
      fetchAttendanceData(netraID);
    }
  }, [netraID]);

  const fetchAttendanceData = async (netraID) => {
    try {
      const response = await axios.post('http://teleuniv.in/netra/api.php', {
        method: '314',
        rollno: netraID
      });
      const data = response.data.overallattperformance.overall;
      setAttendanceData(data);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    } finally {
      setLoading(false); // Update loading state once data is fetched
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
      width: '30%', // Adjust the width based on your preference
    },
    {
      title: 'Theory (%)',
      dataIndex: 'percentage',
      key: 'percentage',
      render: (percentage) => {
        const percentValue = percentage === '--' ? 0 : parseFloat(percentage);
        const color = percentage === '100' || percentage === '--' ? '#137512' : null;
        return <Progress percent={percentValue} size="small" style={{ width: '80px' }} strokeColor={color} />;
      },
    },
    {
      title: 'Practicals (%)',
      dataIndex: 'practical',
      key: 'practical',
      render: (practical) => {
        const percentValue = practical === '--' ? 0 : parseFloat(practical);
        const color = practical === '100' || practical === '--' ? '#137512' : null;
        return <Progress percent={percentValue} size="small" style={{ width: '80px' }} strokeColor={color} />;
      },
    },
  ];

  return (
    <>
      <Navbar /> {/* Include the Navbar component */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
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
            />
          )}
        </div>
      </div>
    </>
  );
};


export default AttendancePage;
