import React from 'react';
import Loader from './Loader'; // Import the Loader component
import { Col, Card, Table } from 'antd';
import './internal.css'; // Import the CSS file

const InternalResultComponent = ({ resultData }) => {
  if (!resultData || resultData.length === 0) {
    return <Loader />; // Render the loader if the resultData prop is empty
  }

  return (
    <>
      {resultData.map((semester, index) => (
        <Col key={index} xs={24}>
          <Card style={{ marginBottom: '20px', boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', borderRadius: '8px' }}>
            <h2 style={{ textAlign: 'center' }}>{semester.title}</h2>
            <Table
              columns={semester.columns.map(column => ({
                title: <span style={{ color: 'blue' }}>{column}</span>,
                dataIndex: column,
                key: column,
                render: text => <span style={{ color: 'blue' }}>{text}</span>,
              }))}
              dataSource={semester.data}
              pagination={false}
              size="small"
              style={{ color: 'blue' }}
            />
          </Card>
        </Col>
      ))}
    </>
  );
};

export default InternalResultComponent;