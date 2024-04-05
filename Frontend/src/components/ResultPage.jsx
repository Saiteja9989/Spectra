import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col, Tabs } from 'antd';
import InternalResultComponent from './InternalResultComponent';
import ExternalResultComponent from './ExternalResultComponent';

const { TabPane } = Tabs;

const ResultPage = ({ netraID }) => {
  const [internalResultData, setInternalResultData] = useState([]);
  const [externalResultData, setExternalResultData] = useState([]);
  const [selectedTab, setSelectedTab] = useState('internal'); // Default selected tab

  useEffect(() => {
    fetchInternalResultData();
    fetchExternalResultData();
  }, [netraID]);

  const fetchInternalResultData = async () => {
    try {
      const response = await axios.get('http://teleuniv.in/trinetra/pages/lib/student_ajaxfile.php', {
        params: { mid: 76, rollno: netraID }
      });
      parseHtml(response.data, setInternalResultData);
    } catch (error) {
      console.error('Error fetching internal result data:', error);
    }
  };

  const fetchExternalResultData = async () => {
    try {
        const yearRange = [1, 2, 3, 4]; // Define the range of years
        const semesterRange = [1, 2];    // Define the range of semesters
        const allResults = []; // Accumulate all semester results here

        for (let year of yearRange) {
            for (let semester of semesterRange) {
                const response = await axios.get('http://teleuniv.in/trinetra/pages/lib/student_ajaxfile.php', {
                    params: { mid: 57, rollno: netraID, year, sem: semester }
                });
              console.log(response.data);
                console.log(`Results for Year ${year}, Semester ${semester}:`, response.data);
                const parsedData = parseHtml1(response.data); // Parse HTML data
                if (parsedData) {
                    allResults.push({
                        year,
                        semester,
                        ...parsedData,
                    });
                }
            }
        }
        console.log(allResults)
        setExternalResultData(allResults); // Update state with all semester results
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
        return { columns, data: [], creditsAcquired: 'N/A', sgpa: 'N/A' }; // Set credits and sgpa as 'N/A'
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
    
      // Extract SGPA and credits only if available
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
    
    const parseBacklogHtml = (htmlData) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlData, 'text/html');
  
      // Extract the total backlogs from the HTML
      const totalBacklogsElement = doc.querySelector('#backlogs');
      let totalBacklogs = 0;
      if (totalBacklogsElement) {
          totalBacklogs = parseInt(totalBacklogsElement.textContent.trim(), 10);
      }
  
      return totalBacklogs;
  };
  


    
  const handleTabChange = (key) => {
    setSelectedTab(key);
  };

  return (
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
              <ExternalResultComponent resultData={externalResultData} />
            </Row>
          </TabPane>
        </Tabs>
      </Col>
    </Row>
  );
};

export default ResultPage;
