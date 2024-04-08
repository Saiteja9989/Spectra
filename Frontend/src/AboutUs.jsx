import React from 'react';
import { Typography, Card } from 'antd';

const { Title, Paragraph } = Typography;

const AboutUs = () => {
  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>About Agni KMIT</Title>
      <Card>
        <Typography>
          <Paragraph>
          Discover our user-friendly web platform tailored for college students! Easily access attendance records, profile details, and academic results with just a few inputs like first or last name, or student ID.
          </Paragraph>
          <Paragraph>
          Embrace the future of academic management with us as we redefine student interaction with their educational journey. Welcome to a new era of accessibility and transparency in college administration.
          </Paragraph>
          {/* Add more paragraphs or sections as needed */}
        </Typography>
      </Card>
      <Title level={4}>Contact Details</Title>
      <Card style={{ marginTop: '20px' }}>
        <Typography>
        <Paragraph>
            <strong>Host1 :</strong> KASOJU SAITEJA
          </Paragraph>
          <Paragraph>
            <strong>Academic Details:</strong> 2-YR CSE C
          </Paragraph>
          <Paragraph>
            <strong>Email:</strong> example@example.com
          </Paragraph>
          <Paragraph>
            <strong>Phone:</strong> 7569295934
          </Paragraph>
          {/* Add more contact details if needed */}
        </Typography>
        
      </Card>
      <Card style={{ marginTop: '20px' }}>
        <Typography>
        <Paragraph>
            <strong>Host2 :</strong> ABHILASH REDDY (22BD1A054Q)
          </Paragraph>
        <Paragraph>
            <strong>Academic Details :</strong> 2-YR CSE C
          </Paragraph>
          <Paragraph>
            <strong>Email:</strong> example@example.com
          </Paragraph>
          <Paragraph>
            <strong>Phone:</strong> 9515360456
          </Paragraph>
          {/* Add more contact details if needed */}
        </Typography>
        
      </Card>
    </div>
  );
};

export default AboutUs;
