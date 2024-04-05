import React from 'react';
import { Card, Table } from 'antd';

const ExternalResultComponent = ({ resultData }) => {
  const renderSemesterResults = () => {
    if (!resultData || resultData.length === 0) {
      return <div>No external data available</div>;
    }

    // Define year and semester combinations
    const yearSemesterCombinations = [
      { year: 1, semester: 1 },
      { year: 1, semester: 2 },
      { year: 2, semester: 1 },
      { year: 2, semester: 2 },
      { year: 3, semester: 1},
      { year: 3, semester: 2 },
      { year: 4, semester: 1 },
      { year: 4, semester: 2 },
      // Add more combinations as needed
    ];

    // Filter resultData based on year and semester combinations
    const filteredResults = yearSemesterCombinations.map(({ year, semester }) => {
      return resultData.find(result => result.year === year && result.semester === semester);
    });

    return filteredResults.map((semester, index) => (
      <Card key={index} style={{ marginBottom: '20px', boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', borderRadius: '8px', width: '100%', padding: '20px' }}>
        <h2 style={{ textAlign: 'center' }}>{`Year ${semester.year}, Semester ${semester.semester}`}</h2>
        {semester.data && semester.data.length > 0 ? (
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
        ) : (
          <div style={{ textAlign: 'center', marginTop: '20px', color: 'red' }}>No semester information found for the row</div>
        )}
        {semester.creditsAcquired !== 'N/A' && semester.sgpa !== 'N/A' && (
          <div style={{ textAlign: 'center', marginTop: '10px' }}>
            <span style={{ fontWeight: 'bold' }}>CREDITS ACQUIRED: </span>
            <span>{semester.creditsAcquired}</span>
            <span style={{ margin: '0 10px' }}>|</span>
            <span style={{ fontWeight: 'bold' }}>SGPA: </span>
            <span>{semester.sgpa}</span>
          </div>
        )}
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
