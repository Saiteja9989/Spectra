import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Parser } from 'html-to-react';
import { Table, Tabs } from 'antd';
import './Timetable.css';
import Loader from './Loader';
import Navbar from './Navbar';
import { baseUrl } from '../baseurl';
import Cookies from 'js-cookie'; // Import js-cookie for cookie management

const { TabPane } = Tabs;

const Timetable = () => {
  const [loading, setLoading] = useState(false);
  const [timetableData, setTimetableData] = useState([]);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [token, setToken] = useState(null); // State to hold token
  const parser = new Parser();

  useEffect(() => {
    // Retrieve token from cookies
    const storedToken = Cookies.get('token');
    if (storedToken) {
      setToken(storedToken);
      fetchData(storedToken);
    }
  }, []);

  useEffect(() => {
    // Fetch timetable data whenever token changes
    if (token) {
      fetchData(token);
    }
  }, [token]);

  const fetchData = async (currentToken) => {
    setLoading(true);
    try {
      const response = await axios.post(`${baseUrl}/api/timetable`, {
        method: "317"
      }, {
        headers: {
          Authorization: `Bearer ${currentToken}`
        }
      });
      let updatedTimetable;
      let timetable = response.data.timetable;
      if(timetable!==null){
        const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        updatedTimetable = daysOfWeek.map((day) => {
        const dayData = timetable.find((item) => item.dayname === day);
        return dayData || { dayname: day, beforelunch: [], lunch: '', afterlunch: [] };
      });
      }
      else{
        const dayData=null;
        return dayData;
      }
      setTimetableData(updatedTimetable);
    } catch (error) {
      console.error('Error fetching timetable:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderTimetableForDay = (dayData) => {
    if (!dayData || !dayData.dayname) return "TimeTable is not updated yet!";
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
      <div>
        <h1 style={{ marginBottom: 10, fontSize: '1rem' }}>{dayData.dayname}</h1>
        <h3 style={{ marginBottom: 10, fontSize: '1rem' }}>Before Lunch</h3>
        <Table
          dataSource={dayData.beforelunch}
          columns={columns}
          pagination={false}
          size="small"
          scroll={{ x: true }}
        />
        <h3 style={{ margin: '12px 0', fontSize: '1.2rem' }}>Lunch</h3>
        <p style={{ marginBottom: 12, fontSize: '1rem' }}>{dayData.lunch}</p>
        <h3 style={{ marginBottom: 10, fontSize: '1rem' }}>After Lunch</h3>
        <Table
          dataSource={dayData.afterlunch}
          columns={columns}
          pagination={false}
          size="small"
          scroll={{ x: true }}
        />
      </div>
    );
  };

  const handleTabClick = (day) => {
    setSelectedDay(day);
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', marginBottom: 20 }}>Timetable</h1>
        {loading ? (
          <Loader />
        ) : (
          <Tabs activeKey={selectedDay} onTabClick={handleTabClick}>
            {timetableData.map((dayData) => (
              <TabPane tab={dayData.dayname} key={dayData.dayname}>
                {renderTimetableForDay(dayData)}
              </TabPane>
            ))}
          </Tabs>
        )}
      </div>
    </>
  );
};

export default Timetable;
