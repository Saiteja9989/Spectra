import React from 'react';
import { Table } from 'antd';

const Timetable = () => {
  const timetableData = [
    {
      period: '10.00 AM - 10.50 AM',
      subject: 'SMCS',
    },
    {
      period: '10.50 AM - 11.40 AM',
      subject: 'SMCS',
    },
    {
      period: '11.40 AM - 11.50 AM',
      subject: 'Short Break',
    },
    {
      period: '11.50 AM - 12.40 PM',
      subject: 'DBMS_LAB',
    },
    {
      period: '12.40 PM - 01.30 PM',
      subject: 'DBMS_LAB',
    },
    {
      period: 'Lunch: 01.30 PM - 02.15 PM',
      subject: 'Lunch',
    },
    {
      period: '02.15 PM - 03.00 PM',
      subject: 'JAVA',
    },
    {
      period: '03.00 PM - 03.45 PM',
      subject: 'JAVA',
    },
    {
      period: '03.45 PM - 04.30 PM',
      subject: '2-ACD',
    },
  ];

  const columns = [
    {
      title: 'Period',
      dataIndex: 'period',
      key: 'period',
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
    },
  ];

  return (
    <div>
      <h2>Monday</h2>
      <Table dataSource={timetableData} columns={columns} pagination={false} />
    </div>
  );
};

export default Timetable;
