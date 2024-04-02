import React, { useState, useEffect } from 'react';
import { Layout, Menu, Row, Col, Avatar, Typography, Card } from 'antd';
import { ClusterOutlined, ScheduleOutlined, SolutionOutlined, UserOutlined, LineChartOutlined, MessageOutlined } from '@ant-design/icons';
import './dashboard.css';
import axios from 'axios';
import CircularProgressWithLabel from './AttendanceTracker';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { Meta } = Card;

const ProfilePage = ({ netraID }) => {
  const [profileDetails, setProfileDetails] = useState(null);
  const [attendanceData, setAttendanceData] = useState(null);
  const [attendancePer, setAttendancePer] = useState(0);

  useEffect(() => {
    if (netraID) {
      fetchProfileData(netraID);
      fetchAttendanceData(netraID);
    }
  }, [netraID]);

  const fetchProfileData = async (netraID) => {
    try {
      const response = await axios.post('http://teleuniv.in/netra/api.php', {
        method: '32',
        rollno: netraID
      });
      const data = response.data;
      setProfileDetails(data);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  const fetchAttendanceData = async (netraID) => {
    try {
      const response = await axios.post('http://teleuniv.in/netra/api.php', {
        method: '314',
        rollno: netraID
      });
      const data = response.data.attandance.dayobjects;
      const data1 = response.data.overallattperformance.totalpercentage;
      setAttendanceData(data);
      setAttendancePer(data1);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    }
  };

  return (
    <Layout>
      <Header>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
          <Menu.Item key="1">Home</Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: '0 10px', marginTop: '20px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={12} lg={8} xl={8}>
            <Card style={{ minHeight: '300px', textAlign: 'center' }}>
              {profileDetails && (
                <Avatar size={150} icon={<UserOutlined />} src={profileDetails.picture} />
              )}
              <div style={{ marginTop: '20px' }}>
                {profileDetails && (
                  <div>
                    <Title level={4}>{profileDetails.firstname}</Title>
                    <Text>Hall Ticket No: {profileDetails.hallticketno}</Text>
                    <br />
                    <Text>Department: {profileDetails.dept}</Text>
                    <br />
                    <Text>Section: {profileDetails.section}</Text>
                    <br />
                    <Text>Current Year: {profileDetails.currentyear}</Text>
                    <br />
                    <Text>Year of Admission: {profileDetails.yearofadmision}</Text>
                    <br />
                    <Text>Phone: {profileDetails.phone}</Text>
                    <br />
                  </div>
                )}
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12} lg={16} xl={16}>
            <Card style={{ minHeight: '400px' }}>
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <Title level={4}>Latest Attendance</Title>
                {attendanceData && (
                  <Row gutter={[16, 16]}>
                    <table>
                      <tbody >
                        {attendanceData.slice(0, 5).map((dayObject, index) => (
                          <tr key={index} style={{ padding: '8px' }}>
                            <td style={{ paddingRight: '8px',paddingLeft:"58px",paddingTop:"0px" }}>{dayObject.date}:</td>
                            {Object.values(dayObject.sessions).map((sessionValue, sessionIndex) => (
                              <td key={sessionIndex} style={{ paddingRight: '8px' }}>
                                {parseInt(sessionValue) === 1 ? ' ✅ ' : parseInt(sessionValue) === 0 ? '❌' : '⭕'}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Row>
                )}
                
              </div>
            </Card>
          </Col>
        </Row>
        <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
          <Col span={24}>
            <Title level={4}>Options</Title>
            <Row gutter={[16, 16]}>
              <Col xs={12} sm={12} md={8} lg={6} xl={6}>
                <Card
                  hoverable
                  className="option-card"
                >
                  <Meta title="Clubs" avatar={<ClusterOutlined />} />
                </Card>
              </Col>
              <Col xs={12} sm={12} md={8} lg={6} xl={6}>
                <Card
                  hoverable
                  className="option-card"
                >
                  <Meta title="Attendance" avatar={<ScheduleOutlined />} />
                </Card>
              </Col>
              <Col xs={12} sm={12} md={8} lg={6} xl={6}>
                <Card
                  hoverable
                  className="option-card"
                >
                  <Meta title="Results" avatar={<LineChartOutlined />} />
                </Card>
              </Col>
              <Col xs={12} sm={12} md={8} lg={6} xl={6}>
                <Card
                  hoverable
                  className="option-card"
                >
                  <Meta title="Timetable" avatar={<SolutionOutlined />} />
                </Card>
              </Col>
              <Col xs={12} sm={12} md={8} lg={6} xl={6}>
                <Card
                  hoverable
                  className="option-card"
                >
                  <Meta title="Feedback" avatar={<MessageOutlined />} />
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default ProfilePage;
