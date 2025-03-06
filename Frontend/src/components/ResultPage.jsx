import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import InternalResultComponent from "./InternalResultComponent";
import ExternalResultComponent from "./ExternalResultComponent";
import { baseUrl } from "../baseurl";
import { BookOpen, GraduationCap, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
import Navbar from "./Navbar";
import { useDarkMode } from './DarkModeContext' // Import useDarkMode hook

const ResultPage = () => {
  const [internalResultData, setInternalResultData] = useState([]);
  const [externalResultData, setExternalResultData] = useState([]);
  const [selectedTab, setSelectedTab] = useState("internal");
  const [totalBacklogs, setTotalBacklogs] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const navigate = useNavigate();
  const { darkMode } = useDarkMode(); // Access dark mode state

  useEffect(() => {
    const rollno = Cookies.get("rollno");
    if (rollno) {
      fetchInternalResultData(rollno);
      fetchExternalResultData(rollno);
    } else {
      console.error("Roll number not found in cookies");
      setIsLoading(false);
    }
  }, []);

  const fetchInternalResultData = async (rollno) => {
    try {
      const response = await axios.post(`${baseUrl}/api/internalResultData`, {
        mid: 76,
        rollno: rollno,
      });
      parseHtml(response.data, setInternalResultData);
    } catch (error) {
      console.error("Error fetching internal result data:", error);
    } finally {
      setIsLoading(false);
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
            rollno: rollno,
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

      const backlogResponse = await axios.post(`${baseUrl}/api/backlogs`, {
        rollno: rollno,
      });
      setTotalBacklogs(backlogResponse.data);
    } catch (error) {
      console.error("Error fetching external result data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const parseHtml = (htmlData, setData) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlData, "text/html");
    const tables = doc.querySelectorAll(".box-body");

    const parsedData = Array.from(tables).map((table) => {
      const titleElement = table.querySelector("h2");
      const title = titleElement ? titleElement.textContent : "";

      const thElements = table.querySelectorAll("th");
      const columns = Array.from(thElements).map((th) => th.textContent);

      const dataRows = table.querySelectorAll("tr");
      const data = Array.from(dataRows)
        .slice(1)
        .map((row) => {
          const rowData = {};
          const tdElements = row.querySelectorAll("td");
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
    const doc = parser.parseFromString(htmlData, "text/html");
    const table = doc.querySelector(".tableofcmm");

    if (!table) {
      console.error("Table not found in HTML data");
      return null;
    }

    const columns = Array.from(table.querySelectorAll("th")).map((th) =>
      th.textContent.trim()
    );
    const rows = Array.from(table.querySelectorAll("tbody tr"));

    if (rows.length === 0) {
      console.warn("No rows found in the table");
      return { columns, data: [], creditsAcquired: "N/A", sgpa: "N/A" };
    }

    const data = rows.map((row) => {
      const rowData = {};
      Array.from(row.querySelectorAll("td")).forEach((td, index) => {
        let textContent = td.textContent.trim();
        if (textContent.toUpperCase() === "NA") {
          textContent = "N/A";
        }
        rowData[columns[index]] = textContent;
      });
      return rowData;
    });

    let creditsAcquired = "N/A";
    let sgpa = "N/A";
    const tfoot = table.querySelector("tfoot");
    if (tfoot) {
      const creditsAcquiredElement = tfoot.querySelector(".creditsacquired");
      const sgpaElement = tfoot.querySelector("td:last-child");
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
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 to-indigo-50 text-gray-900'}`}>
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

      {/* Header */}
      <header className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm pt-14 sm:pt-4`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold flex items-center gap-2">
            <GraduationCap className={`w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            Academic Results
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
           <div className="flex justify-center items-center h-32">
           <div className={`animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 ${
             darkMode ? "border-indigo-400" : "border-indigo-600"
           }`}></div>
         </div> // Show loader while data is being fetched
        ) : (
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden`}>
            {/* Tabs */}
            <div className={`flex border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <button
                onClick={() => handleTabChange("internal")}
                className={`flex-1 py-2 sm:py-3 md:py-4 px-3 sm:px-4 md:px-6 text-center text-xs sm:text-sm md:text-base font-medium ${
                  selectedTab === "internal"
                    ? `${darkMode ? 'text-blue-400 border-b-2 border-blue-400' : 'text-blue-600 border-b-2 border-blue-600'}`
                    : `${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`
                }`}
              >
                <BookOpen className="inline-block w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Internal Assessment
              </button>
              <button
                onClick={() => handleTabChange("external")}
                className={`flex-1 py-2 sm:py-3 md:py-4 px-3 sm:px-4 md:px-6 text-center text-xs sm:text-sm md:text-base font-medium ${
                  selectedTab === "external"
                    ? `${darkMode ? 'text-blue-400 border-b-2 border-blue-400' : 'text-blue-600 border-b-2 border-blue-600'}`
                    : `${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`
                }`}
              >
                <GraduationCap className="inline-block w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Semester Results
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-3 sm:p-4 md:p-6">
              {selectedTab === "internal" ? (
                <InternalResultComponent resultData={internalResultData} darkMode={darkMode} />
              ) : (
                <ExternalResultComponent
                  resultData={externalResultData}
                  totalBacklogs={totalBacklogs}
                  darkMode={darkMode}
                />
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ResultPage;