import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie'; // Import js-cookie for cookie management
import { Row, Col, Tabs } from 'antd';
import InternalResultComponent from './InternalResultComponent';
import ExternalResultComponent from './ExternalResultComponent';
import Navbar from './Navbar';
const { TabPane } = Tabs;
import { baseUrl } from '../baseurl';

const ResultPage = () => {
  const [internalResultData, setInternalResultData] = useState([]);
  const [externalResultData, setExternalResultData] = useState([]);
  const [selectedTab, setSelectedTab] = useState('internal'); 
  const [totalBacklogs, setTotalBacklogs] = useState(null);

  useEffect(() => {
    const rollno = Cookies.get('rollno'); // Get rollno from cookie
    if (rollno) {
      fetchInternalResultData(rollno);
      fetchExternalResultData(rollno);
    } else {
      console.error('Roll number not found in cookies');
    }
  }, []);

  const fetchInternalResultData = async (rollno) => {
    try {
      const response = await axios.post(`${baseUrl}/api/internalResultData`, {
        mid: 76,
        rollno: rollno
      });
      parseHtml(response.data, setInternalResultData);
    } catch (error) {
      console.error('Error fetching internal result data:', error);
    }
  };
  

  const fetchExternalResultData = async (rollno) => {
    try {
      const yearRange = [1, 2, 3, 4]; 
      const semesterRange = [1, 2];    
      const allResults = []; 
  
      for (let year of yearRange) {
        for (let semester of semesterRange) {
          const response = await axios.post(`${baseUrl}/api/externalResultData`, {
            year,
            semester,
            rollno: rollno
          });
          const parsedData = parseHtml1(response.data); 
          if (parsedData) {
            allResults.push({
              year,
              semester,
              ...parsedData,
            });
          }
        }
      }
      
      setExternalResultData(allResults); 
  
      const backlogResponse = await axios.post(`${baseUrl}/api/backlogs`, { rollno: rollno });
  
      const totalBacklogs = backlogResponse.data;
      console.log('Total backlogs:', totalBacklogs);
  
      setTotalBacklogs(totalBacklogs);
    } catch (error) {
      console.error('Error fetching external result data:', error);
    }
  };

  const parseHtml = (htmlData, setData) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlData, 'text/html');
    const tables = doc.querySelectorAll('.box-body');

    const parsedData = Array.from(tables).map(table => {
      const titleElement = table.querySelector('h2');
      const title = titleElement ? titleElement.textContent : '';
      
      const thElements = table.querySelectorAll('th');
      const columns = Array.from(thElements).map(th => th.textContent);

      const dataRows = table.querySelectorAll('tr');
      const data = Array.from(dataRows).slice(1).map(row => {
        const rowData = {};
        const tdElements = row.querySelectorAll('td');
        tdElements.forEach((td, index) => {
          if (columns[index]) {
            rowData[columns[index]] = td.textContent;
          }
        });
        return rowData;
      });

      return { title, columns, data };
    });

    setData(parsedData);
  };
    

  const parseHtml1 = (htmlData) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlData, 'text/html');
    const table = doc.querySelector('.tableofcmm');
  
    if (!table) {
      console.error('Table not found in HTML data');
      return null;
    }
  
    const columns = Array.from(table.querySelectorAll('th')).map(th => th.textContent.trim());
    const rows = Array.from(table.querySelectorAll('tbody tr'));
  
    if (rows.length === 0) {
      console.warn('No rows found in the table');
      return { columns, data: [], creditsAcquired: 'N/A', sgpa: 'N/A' }; 
    }
  
    const data = rows.map(row => {
      const rowData = {};
      Array.from(row.querySelectorAll('td')).forEach((td, index) => {
        let textContent = td.textContent.trim();
        // Replace 'NA' with 'N/A'
        if (textContent.toUpperCase() === 'NA') {
          textContent = 'N/A';
        }
        rowData[columns[index]] = textContent;
      });
      return rowData;
    });
  
    
    let creditsAcquired = 'N/A';
    let sgpa = 'N/A';
    const tfoot = table.querySelector('tfoot');
    if (tfoot) {
      const creditsAcquiredElement = tfoot.querySelector('.creditsacquired');
      const sgpaElement = tfoot.querySelector('td:last-child');
      if (creditsAcquiredElement && sgpaElement) {
        creditsAcquired = creditsAcquiredElement.textContent.trim();
        sgpa = sgpaElement.textContent.trim();
      }
    }
  
    return { columns, data, creditsAcquired, sgpa };
  };

  const handleTabChange = (key) => {
    setSelectedTab(key);
  };

  return (
    <>
      <Navbar />
      <Row justify="center">
        <Col xs={24} sm={20}>
          <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Result Page</h1>
          <Tabs activeKey={selectedTab} onChange={handleTabChange}>
            <TabPane tab="Internal" key="internal">
              <Row gutter={[16, 16]}>
                <InternalResultComponent resultData={internalResultData} />
              </Row>
            </TabPane>
            <TabPane tab="External" key="external">
              <Row gutter={[16, 16]}>
                <ExternalResultComponent resultData={externalResultData} totalBacklogs={totalBacklogs} />
              </Row>
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    </>
  );
};

export default ResultPage;