import React from 'react';
import { Typography, Card } from 'antd';
import { ZoomInOutlined } from '@ant-design/icons'; // Import transition effect
import Navbar from './components/Navbar';
const { Title, Paragraph } = Typography;

const AboutUs = () => {
  return (
    <>
      <Navbar/>
    <div style={{ padding: '20px' }}>
      <Title level={2}>About KMIT Spectra</Title>
      <Card hoverable style={{ marginBottom: '20px' }}>
        <Typography>
          <Paragraph>
          Explore our intuitive web platform designed by students for students! Seamlessly navigate attendance records, profile details, and academic results using minimal input such as Name, Phone number, or student ID.
          </Paragraph>
          <Paragraph>
          Join us in reshaping student engagement with their educational path. Welcome to a fresh era of accessibility and transparency in academic administration
          </Paragraph>
        </Typography>
      </Card>
      </div>
      </>
  );
};

export default AboutUs;
