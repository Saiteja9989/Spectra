import React, { useState, useEffect } from 'react';
import { Tabs, Table, Spin, Card } from 'antd';
import axios from 'axios';
import { Parser } from 'html-to-react';

const { TabPane } = Tabs;

const Timetable = ({ netraID }) => {
  const [loading, setLoading] = useState(false);
  const [timetableData, setTimetableData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.post('http://teleuniv.in/netra/api.php', {
          method: "317",
          rollno: netraID
        });
        setTimetableData(response.data.timetable);
      } catch (error) {
        console.error('Error fetching timetable:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const parser = new Parser();

  const renderTimetableForDay = (dayData) => {
    const columns = [
      {
        title: 'Period',
        dataIndex: 'hour',
        key: 'hour',
        render: (text) => parser.parse(text),
      },
      {
        title: 'Subject',
        dataIndex: 'subject',
        key: 'subject',
      },
    ];

    return (
      <Card
        title={dayData.dayname}
        style={{ marginBottom: 20, width: '100%', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: 6 }}
      >
        <div>
          <h3 style={{ marginBottom: 10, fontSize: 14 }}>Before Lunch</h3>
          <Table dataSource={dayData.beforelunch} columns={columns} pagination={false} size="small" />
          <h3 style={{ margin: '12px 0', fontSize: 14 }}>Lunch</h3>
          <p style={{ marginBottom: 12, fontSize: 14 }}>{dayData.lunch}</p>
          <h3 style={{ marginBottom: 10, fontSize: 14 }}>After Lunch</h3>
          <Table dataSource={dayData.afterlunch} columns={columns} pagination={false} size="small" />
        </div>
      </Card>
    );
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: 20 }}>Timetable</h1>
      {loading ? (
        <Spin size="large" />
      ) : (
        <Tabs defaultActiveKey="Monday" centered>
          {timetableData.map((dayData) => (
            <TabPane tab={dayData.dayname} key={dayData.dayname}>
              {renderTimetableForDay(dayData)}
            </TabPane>
          ))}
        </Tabs>
      )}
    </div>
  );
};

export default Timetable;
