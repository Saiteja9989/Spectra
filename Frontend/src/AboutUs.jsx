import React from 'react';
import { Typography, Card } from 'antd';
import { ZoomInOutlined } from '@ant-design/icons'; // Import transition effect

const { Title, Paragraph } = Typography;

const AboutUs = () => {
  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>About Agni KMIT</Title>
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
      <Title level={4}>Contact Details</Title>
      <Card hoverable style={{ marginBottom: '20px' }}>
        <Typography>
          <Paragraph>
            <strong>Host1 :</strong> KASOJU SAITEJA (22BD1A054V)
          </Paragraph>
          <Paragraph>
            <strong>Academic Details:</strong> 2-YR CSE A
          </Paragraph>
          <Paragraph>
            <strong>Email:</strong> kasojusaiteja10@gmail.com
          </Paragraph>
          <Paragraph>
            <strong>Phone:</strong> 7569295934
          </Paragraph>
        </Typography>
      </Card>
      <Card hoverable style={{ marginBottom: '20px' }}>
        <Typography>
          <Paragraph>
            <strong>Host2 :</strong> ABHILASH REDDY (22BD1A054Q)
          </Paragraph>
          <Paragraph>
            <strong>Academic Details :</strong> 2-YR CSE C
          </Paragraph>
          <Paragraph>
            <strong>Email:</strong> abhigxtheupm@gmail.com
          </Paragraph>
          <Paragraph>
            <strong>Phone:</strong> 9515360456
          </Paragraph>
        </Typography>
      </Card>
    </div>
  );
};

export default AboutUs;
