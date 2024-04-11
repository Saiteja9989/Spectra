import React, { useState, useEffect, useRef } from 'react';
import { Tabs, Table, Card } from 'antd';
import axios from 'axios';
import { Parser } from 'html-to-react';
import './Timetable.css';
import Loader from './Loader'; // Import the Loader component
import Navbar from './Navbar';
import { baseUrl } from '../baseurl';
const { TabPane } = Tabs;

const Timetable = ({ netraID }) => {
  const [loading, setLoading] = useState(false);
  const [timetableData, setTimetableData] = useState([]);
  const tabsRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.post(`${baseUrl}/api/timetable`, {
          netraID: netraID,
        });
        let timetable = response.data.timetable;

        // Ensure all days of the week are present
        const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const updatedTimetable = daysOfWeek.map((day) => {
          const dayData = timetable.find((item) => item.dayname === day);
          return dayData || { dayname: day, beforelunch: [], lunch: '', afterlunch: [] };
        });

        // Sort the timetable data so that Monday comes first
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
  }, [netraID]);;

  const parser = new Parser();

  useEffect(() => {
    if (tabsRef.current) {
      const tabListWidth = tabsRef.current.offsetWidth;
      const numTabs = timetableData.length;
      const minTabsWidth = numTabs * 120; // Increase the minimum width for each tab to 120px
      tabsRef.current.style.width = `${Math.max(tabListWidth, minTabsWidth)}px`;
    }
  }, [timetableData]);

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

    // Hide the 'hour' column on smaller screens
    const mobileColumns = [
      {
        title: 'Subject',
        dataIndex: 'subject',
        key: 'subject',
      },
    ];

    return (
      <Card
        title={dayData.dayname}
        style={{
          marginBottom: 20,
          width: '100%', // Adjust card width to fit the screen width
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          borderRadius: 6,
        }}
      >
        <div>
          <h3 style={{ marginBottom: 10, fontSize: '1.2rem' }}>Before Lunch</h3>
          <Table
            dataSource={dayData.beforelunch}
            columns={columns}
            pagination={false}
            size="small"
            scroll={{ x: true }}
          />
          <h3 style={{ margin: '12px 0', fontSize: '1.2rem' }}>Lunch</h3>
          <p style={{ marginBottom: 12, fontSize: '1rem' }}>{dayData.lunch}</p>
          <h3 style={{ marginBottom: 10, fontSize: '1.2rem' }}>After Lunch</h3>
          <Table
            dataSource={dayData.afterlunch}
            columns={columns}
            pagination={false}
            size="small"
            scroll={{ x: true }}
          />
        </div>
      </Card>
    );
  };

  return (
    <>
      <Navbar/>
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: 20 }}>Timetable</h1>
      {loading ? (
        <Loader /> // Display the Loader component while loading
      ) : (
        <div style={{ overflowX: 'auto', width: '100%' }}>
          <Tabs
            defaultActiveKey={null}
            centered
            renderTabBar={(props, DefaultTabBar) => (
              <DefaultTabBar {...props} moreIcon={<span>...</span>} />
            )}
            ref={tabsRef}
            className="custom-tabs"
          >
            {/* Render Monday TabPane if it exists in timetableData */}
            {timetableData.find((dayData) => dayData.dayname === 'Monday') && (
              <TabPane
                tab="Monday"
                key="Monday"
                style={{ minWidth: '120px' }}
              >
                {/* Render timetable data for Monday */}
                {timetableData.map((dayData) => (
                  dayData.dayname === 'Monday' && renderTimetableForDay(dayData)
                ))}
              </TabPane>
            )}
            {/* Render other TabPanels */}
            {timetableData.map((dayData, index) => (
              dayData.dayname !== 'Monday' && (
                <TabPane
                  tab={dayData.dayname}
                  key={`${dayData.dayname}-${index}`} // Ensure unique key by including index
                  style={{ minWidth: '80px' }} // Set a minimum width for other tabs
                >
                  {renderTimetableForDay(dayData)}
                </TabPane>
              )
            ))}
          </Tabs>
        </div>
      )}
      </div>
      </>
  );
};

export default Timetable;
