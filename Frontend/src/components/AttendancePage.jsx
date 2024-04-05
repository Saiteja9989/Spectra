import React, { useState, useEffect } from 'react';
import { Table, Progress, Button } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LeftOutlined } from '@ant-design/icons';

const AttendancePage = ({ netraID }) => {
  const [attendanceData, setAttendanceData] = useState(null);
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
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
      {/* <Button type="primary" icon={<LeftOutlined />} onClick={handleBackButtonClick} size="small" style={{ alignSelf: 'flex-start', marginBottom: '10px' }}>
        Back
      </Button> */}
      <div style={{ flex: '1' }}>
        <Table
          dataSource={attendanceData}
          columns={columns}
          bordered
          size="small"
          pagination={false} // Remove pagination
        />
      </div>
    </div>
  );
};

export default AttendancePage;
