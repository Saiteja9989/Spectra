import React from 'react';
import { Card, Table } from 'antd';

const ExternalResultComponent = ({ resultData, totalBacklogs }) => {
  const renderSemesterResults = () => {
    if (!resultData || resultData.length === 0) {
      return <div>No external result data available</div>;
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {totalBacklogs !== null && (
          <div style={{ textAlign: 'center', marginBottom: '20px', color: 'red', width: '100vw' }}>
            <h2>Total Backlogs: {totalBacklogs}</h2>
          </div>
        )}
        {resultData.map((semester, index) => (
          <Card
            key={index}
            style={{
              marginBottom: '20px',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
              borderRadius: '8px',
              width: '90%', // Set width to 90% of the viewport width
              padding: '20px',
            }}
            bodyStyle={{ overflow: 'hidden' }} // Ensure that scrolling is disabled within the card
          >
            <h2 style={{ textAlign: 'center' }}>{`Year ${semester.year}, Semester ${semester.semester}`}</h2>
            {semester.data && semester.data.length > 0 ? (
              <Table
                columns={semester.columns.map(col => ({ title: col, dataIndex: col, key: col }))}
                dataSource={semester.data}
                pagination={false}
                size="small"
              />
            ) : (
              <div style={{ textAlign: 'center', marginTop: '20px', color: 'red' }}>No semester information found for the row</div>
            )}
            {semester.creditsAcquired !== 'N/A' && semester.sgpa !== 'N/A' && (
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <span style={{ fontWeight: 'bold' }}>CREDITS ACQUIRED: </span>
                <span>{semester.creditsAcquired}</span>
                <span style={{ margin: '0 10px' }}>|</span>
                <span style={{ fontWeight: 'bold' }}>SGPA: </span>
                <span>{semester.sgpa}</span>
              </div>
            )}
          </Card>
        ))}
      </div>
    );
  };

  return <div style={{ width: '100%', padding: '20px' }}>{renderSemesterResults()}</div>;
};

export default ExternalResultComponent;
