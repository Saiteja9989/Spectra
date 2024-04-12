import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Parser } from 'html-to-react';
import { Table, Card } from 'antd';
import './Timetable.css';
import Loader from './Loader';
import Navbar from './Navbar';
import { baseUrl } from '../baseurl';

const Timetable = ({ netraID }) => {
  const [loading, setLoading] = useState(false);
  const [timetableData, setTimetableData] = useState([]);
  const [selectedDay, setSelectedDay] = useState('Monday'); // Default selected day
  const parser = new Parser();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.post(`${baseUrl}/api/timetable`, {
          netraID: netraID,
        });
        let timetable = response.data.timetable;

        const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const updatedTimetable = daysOfWeek.map((day) => {
          const dayData = timetable.find((item) => item.dayname === day);
          return dayData || { dayname: day, beforelunch: [], lunch: '', afterlunch: [] };
        });

        const sortedTimetable = updatedTimetable.sort((a, b) => {
          if (a.dayname === 'Monday') return -1;
          if (b.dayname === 'Monday') return 1;
          return 0;
        });

        setTimetableData(sortedTimetable);
      } catch (error) {
        console.error('Error fetching timetable:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [netraID]);

  const renderTimetableForDay = (dayData) => {
    if (!dayData || !dayData.dayname) return null; // Check if dayData is defined and has a dayname property
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

  const handleDayClick = (day) => {
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
          <div style={{ display: 'flex', overflowX: 'auto', marginBottom: 20 }}>
            {timetableData.map((dayData) => (
              <button
                key={dayData.dayname}
                style={{
                  marginRight: 10,
                  padding: '5px 10px',
                  backgroundColor: selectedDay === dayData.dayname ? '#1890ff' : '#e8e8e8',
                  color: selectedDay === dayData.dayname ? 'white' : 'black',
                  border: 'none',
                  borderRadius: 5,
                  cursor: 'pointer',
                  outline: 'none',
                }}
                onClick={() => handleDayClick(dayData.dayname)}
              >
                {dayData.dayname}
              </button>
            ))}
          </div>
        )}
        {renderTimetableForDay(timetableData.find((dayData) => dayData.dayname === selectedDay))}
      </div>
    </>
  );
};

export default Timetable;
