import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout, Row, Col, Avatar, Typography, Card } from 'antd';
import { ClusterOutlined, ScheduleOutlined, SolutionOutlined, UserOutlined, LineChartOutlined, MessageOutlined,QrcodeOutlined } from '@ant-design/icons';
import './dashboard.css';
import axios from 'axios';
import AttendanceTracker from '../components/AttendanceTracker';
import Swal from 'sweetalert2';
import Navbar from './Navbar'
import { baseUrl } from '../baseurl';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { Meta } = Card;

const ProfilePage = ({ netraID }) => {
  const [profileDetails, setProfileDetails] = useState(null);
  const [attendanceData, setAttendanceData] = useState(null);
  const [attendancePer, setAttendancePer] = useState(0);
  const [twoWeekSessions, setTwoWeekSessions] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (netraID) {
      fetchProfileData(netraID);
      fetchAttendanceData(netraID);
    }
  }, [netraID]);

  const handleClubsClick = () => {
    Swal.fire({
      icon: 'info',
      title: 'Club Details',
      text: 'Club details will be updated soon.',
    });
  };

  const fetchProfileData = async (netraID) => {
    try {
      const response = await axios.post(`${baseUrl}/api/profile`, {
        method: '32',
        rollno: netraID
      });
      const data = response.data;
      setProfileDetails(data);
      console.log(profileDetails.picture);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  const fetchAttendanceData = async (netraID) => {
    try {
      const response = await axios.post(`${baseUrl}/api/attendance`, { netraID });
      const { dayObjects, totalPercentage, twoWeekSessions } = response.data;

      setAttendanceData(dayObjects);
      setTwoWeekSessions(twoWeekSessions);
      setAttendancePer(totalPercentage);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    }
  };

  return (
    <Layout>
      <Navbar />
      <Content style={{ padding: '0 10px', marginTop: '20px', overflowY: 'hidden' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={12} lg={8} xl={8}>
            <Card style={{ boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)' }}>
              <div style={{ minHeight: '300px', textAlign: 'center' }}>
                {profileDetails && (
                  <Avatar size={150} icon={<UserOutlined />} src={`data:image/jpeg;base64,${profileDetails.picture}`} />
                )}
                <div style={{ marginTop: '20px' }}>
                  {profileDetails && (
                    <div>
                      <Title level={4}>{profileDetails.firstname}</Title>
                      <div style={{ textAlign: 'center' }}>
                        <table style={{ margin: 'auto' }}>
                          <tbody>
                            <tr>
                              <td>Hall Ticket No:</td>
                              <td style={{ paddingLeft: '8px' }}>{profileDetails.hallticketno}</td>
                            </tr>
                            <tr>
                              <td>Department:</td>
                              <td style={{ paddingLeft: '8px' }}>{profileDetails.dept}</td>
                            </tr>
                            <tr>
                              <td>Section:</td>
                              <td style={{ paddingLeft: '8px' }}>{profileDetails.section}</td>
                            </tr>
                            <tr>
                              <td>Current Year:</td>
                              <td style={{ paddingLeft: '8px' }}>{profileDetails.currentyear}</td>
                            </tr>
                            <tr>
                              <td>Year of Admission:</td>
                              <td style={{ paddingLeft: '8px' }}>{profileDetails.yearofadmision}</td>
                            </tr>
                            {/* <tr>
                              <td>Phone:</td>
                              <td style={{ paddingLeft: '8px' }}>{profileDetails.phone}</td>
                            </tr> */}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12} lg={16} xl={16}>
            <Card style={{ boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)' }}>
              <div style={{ minHeight: '400px', textAlign: 'center', marginTop: '20px' }}>
                <div class="Atten1" style={{ display: 'inline-block', marginRight: '100px' }}>
                  <AttendanceTracker attendancePer={attendancePer} />
                  <div style={{ marginTop: '30px' }}>
                    <p style={{ color: 'gray', fontStyle: 'italic' }}>Note: Attendance prediction will be coming soon</p>
                  </div>
                </div>
                <div className="session1" style={{ textAlign: 'center', display: 'inline-block', verticalAlign: 'top', marginLeft: '20px' }}>
                  <Title level={4}>Latest Attendance</Title>
                  {attendanceData && (
                    <div>
                      <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
                        <table>
                          <tbody>
                            {attendanceData.slice(0, 7).map((dayObject, index) => (
                              <tr key={index} style={{ padding: '8px' }}>
                                <td className="attendance-date">{dayObject.date}:</td>
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
                      <div class="sessoins2w" style={{ textAlign: "center", marginLeft: "60px" }}>
                        <table>
                          <tr>
                            <td>Absent:</td>
                            <td style={{ paddingLeft: '8px' }}>{twoWeekSessions.absent}</td>
                            <td style={{ paddingLeft: '8px' }}>❌</td>
                          </tr>
                          <tr>
                            <td>Present:</td>
                            <td style={{ paddingLeft: '8px' }}>{twoWeekSessions.present}</td>
                            <td style={{ paddingLeft: '8px' }}> ✅ </td>
                          </tr>
                          <tr>
                            <td>No Sessions:</td>
                            <td style={{ paddingLeft: '8px' }}>{twoWeekSessions.nosessions}</td>
                            <td style={{ paddingLeft: '8px' }}>⭕</td>
                          </tr>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </Col>
        </Row>
        <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
          <Col span={24}>
            <Card style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
              <Title level={4}>Options</Title>
              <Row gutter={[16, 16]}>
                <Col xs={12} sm={12} md={8} lg={6} xl={6}>
                  <Card hoverable className="option-card" onClick={handleClubsClick}>
                    <Meta title="Clubs" avatar={<ClusterOutlined />} />
                  </Card>
                </Col>
                <Col xs={12} sm={12} md={8} lg={6} xl={6}>
                  <Card hoverable className="option-card" onClick={() => navigate('/attendance')}>
                    <Meta title="Attendance" avatar={<ScheduleOutlined />} />
                  </Card>
                </Col>
                <Col xs={12} sm={12} md={8} lg={6} xl={6}>
                  <Card hoverable className="option-card" onClick={() => navigate('/result')}>
                    <Meta title="Results" avatar={<LineChartOutlined />} />
                  </Card>
                </Col>
                <Col xs={12} sm={12} md={8} lg={6} xl={6}>
                  <Card hoverable className="option-card" onClick={() => navigate('/timetable')}>
                    <Meta title="Timetable" avatar={<SolutionOutlined />} />
                  </Card>
                </Col>
                <Col xs={12} sm={12} md={8} lg={6} xl={6}>
                  <Card hoverable className="option-card" onClick={() => navigate('/feedback')}>
                    <Meta title="Feedback" avatar={<MessageOutlined />} />
                  </Card>
                </Col>
                <Col xs={12} sm={12} md={8} lg={6} xl={6}>
                  <Card hoverable className="option-card" onClick={() => navigate('/netraqr')}>
                    <Meta title="Netra QR" avatar={<QrcodeOutlined />} />
                  </Card>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default ProfilePage;
