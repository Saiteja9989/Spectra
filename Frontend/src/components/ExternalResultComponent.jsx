import React from 'react';
import { Card, Table } from 'antd';
import Loader from './Loader';
const ExternalResultComponent = ({ resultData, totalBacklogs }) => {
  const renderSemesterResults = () => {
    if (!resultData || resultData.length === 0) {
      return <Loader />;
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {totalBacklogs !== null && (
          <div style={{ textAlign: 'center', marginBottom: '10px', width: '100%' }}>
            <h3 style={{ color: 'red', fontSize: '1.2rem', fontWeight: 'bold', border: '2px solid red', borderRadius: '8px', padding: '10px' }}>Total Backlogs: {totalBacklogs}</h3>
          </div>
        )}
        {resultData.map((semester, index) => (
          <Card
            key={index}
            style={{
              marginBottom: '10px',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
              borderRadius: '8px',
              width: '90%', // Adjusted for responsiveness
              padding: '10px', // Reduced padding for mobile phones
            }}
            bodyStyle={{ overflow: 'hidden' }}
          >
            <h3 style={{ textAlign: 'center', fontSize: '1.2rem' }}>{`Year ${semester.year}, Semester ${semester.semester}`}</h3>
            {semester.data && semester.data.length > 0 ? (
              <>
                <Table
                  columns={semester.columns.map(col => ({
                    title: col,
                    dataIndex: col,
                    key: col,
                    width: col === 'CREDITS ACQUIRED' ? 120 : undefined, // Adjusted width for responsiveness
                  }))}
                  dataSource={semester.data}
                  pagination={false}
                  size="small"
                />
                {/* Display SGPA and Credits Acquired */}
                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                  <span style={{ fontWeight: 'bold' }}>SGPA: </span>
                  <span>{semester.sgpa}</span>
                  <span style={{ margin: '0 10px' }}>|</span>
                  <span style={{ fontWeight: 'bold' }}>Credits Acquired: </span>
                  <span>{semester.creditsAcquired}</span>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', marginTop: '10px', color: 'red', fontSize: '0.9rem' }}>No semester information found for the row</div>
            )}
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div style={{ width: '100%', padding: '10px', overflow: 'hidden' }}>
      {renderSemesterResults()}
    </div>
  );
};

export default ExternalResultComponent;
