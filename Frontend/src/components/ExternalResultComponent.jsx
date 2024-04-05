import React from 'react';
import { Card, Table } from 'antd';

const ExternalResultComponent = ({ resultData }) => {
  const renderSemesterResults = () => {
    if (!resultData || resultData.length === 0) {
      return <div>No external data available</div>;
    }

    return resultData.map((semester, index) => (
      <Card key={index} style={{ marginBottom: '20px', boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', borderRadius: '8px' }}>
        <h2 style={{ textAlign: 'center' }}>{semester.title}</h2>
        <Table
          columns={[
            {
              title: <span style={{ color: 'blue' }}>Sno</span>,
              dataIndex: 'Sno',
              key: 'Sno',
              render: text => <span style={{ color: 'blue' }}>{text || 'N/A'}</span>,
            },
            {
              title: <span style={{ color: 'blue' }}>Subject Name</span>,
              dataIndex: 'Subject Name',
              key: 'Subject Name',
              render: text => <span style={{ color: 'blue' }}>{text || 'N/A'}</span>,
            },
            {
              title: <span style={{ color: 'blue' }}>Grade Points</span>,
              dataIndex: 'Grade Points',
              key: 'Grade Points',
              render: text => <span style={{ color: 'blue' }}>{text || 'N/A'}</span>,
            },
            {
              title: <span style={{ color: 'blue' }}>Grade</span>,
              dataIndex: 'Grade',
              key: 'Grade',
              render: text => <span style={{ color: 'blue' }}>{text || 'N/A'}</span>,
            },
            {
              title: <span style={{ color: 'blue' }}>Credits</span>,
              dataIndex: 'Credits',
              key: 'Credits',
              render: text => <span style={{ color: 'blue' }}>{text || 'N/A'}</span>,
            },
          ]}
          dataSource={semester.data}
          pagination={false}
          size="small"
          style={{ color: 'blue' }}
        />
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <span style={{ fontWeight: 'bold' }}>CREDITS ACQUIRED: </span>
          <span>{semester.creditsAcquired}</span>
          <span style={{ margin: '0 10px' }}>|</span>
          <span style={{ fontWeight: 'bold' }}>SGPA: </span>
          <span>{semester.sgpa}</span>
        </div>
      </Card>
    ));
  };

  return (
    <React.Fragment>
      {renderSemesterResults()}
    </React.Fragment>
  );
};

export default ExternalResultComponent;
