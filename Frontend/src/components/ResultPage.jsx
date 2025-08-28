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
import { useDarkMode } from './DarkModeContext';

const ResultPage = () => {
  const [internalResultData, setInternalResultData] = useState([]);
  const [externalResultData, setExternalResultData] = useState([]);
  const [selectedTab, setSelectedTab] = useState("internal");
  const [totalBacklogs, setTotalBacklogs] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();

  useEffect(() => {
    const token = Cookies.get("token");
    const rollno = Cookies.get("id");
    
    if (token && rollno) {
      fetchExternalResultData(token, rollno);
      fetchInternalResultData(token, rollno);
    } else {
      console.error("Token or roll number not found in cookies");
      setIsLoading(false);
    }
  }, []);

  const fetchExternalResultData = async (token, rollno) => {
    try {
      const response = await axios.post(`${baseUrl}/api/externalResultData`, 
        { rollno }, 
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.Error) {
        console.error("Error fetching external result data:", response.data.message);
        return;
      }
      
      // Transform the API response to match our component's expected format
      const transformedData = transformApiData(response.data.payload);
      setExternalResultData(transformedData);
      
      // Calculate total backlogs
      const backlogs = calculateTotalBacklogs(response.data.payload);
      setTotalBacklogs(backlogs);
    } catch (error) {
      console.error('Error fetching external result data:', error);
      if (error.response && error.response.status === 401) {
        // Token is invalid, redirect to login
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchInternalResultData = async (token, rollno) => {
    try {
      const response = await axios.post(`${baseUrl}/api/internalResultData`, 
        { rollno }, 
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.Error) {
        console.error("Error fetching internal result data:", response.data.message);
        return;
      }
      
      // Transform the API response to match our component's expected format
      const transformedData = transformInternalApiData(response.data.payload);
      setInternalResultData(transformedData);
    } catch (error) {
      console.error('Error fetching internal result data:', error);
      if (error.response && error.response.status === 401) {
        // Token is invalid, redirect to login
        navigate('/login');
      }
    }
  };

  // Transform API data to match the expected format
  const transformApiData = (apiData) => {
    const result = [];
    
    if (!apiData || !apiData.yearlyResults) return result;
    
    Object.entries(apiData.yearlyResults).forEach(([yearKey, yearData]) => {
      const year = parseInt(yearKey.split(" ")[1]);
      
      Object.entries(yearData).forEach(([semesterKey, semesterData]) => {
        const semester = parseInt(semesterKey.split(" ")[1]);
        
        // Create only the required columns
        const columns = [
          "Sno",
          "Subject Name",
          "Grade",
          "Grade Points",
          "Credits"
        ];
        
        // Transform results data with only required fields
        const data = semesterData.results.map((subject, index) => ({
          "Sno": index + 1,
          "Subject Name": subject.subjectName,
          "Grade": subject.grade,
          "Grade Points": subject.gradepoints,
          "Credits": subject.credits
        }));
        
        // Add semester data to result array
        result.push({
          year,
          semester,
          columns,
          data,
          creditsAcquired: semesterData.SGPA?.totalCredits || "N/A",
          sgpa: semesterData.SGPA?.sgpa || "N/A"
        });
      });
    });
    
    return result;
  };

  // Transform internal API data to match the expected format
  const transformInternalApiData = (apiData) => {
    const result = [];
    
    if (!apiData || !Array.isArray(apiData)) return result;
    
    apiData.forEach(yearData => {
      const year = parseInt(yearData.year);
      
      yearData.semesters.forEach(semesterData => {
        const semester = parseInt(semesterData.semester);
        
        semesterData.internal_types.forEach(internalType => {
          const internalTypeNum = parseInt(internalType.internalType);
          
          // Create columns for internal results
          const columns = [
            "Sno",
            "Subject Name",
            "Subject Type",
            "Total Marks",
            "Assignment",
            "Descriptive",
            "Objective"
          ];
          
          // Transform subject data
          const data = internalType.subjects.map((subject, index) => {
            const rowData = {
              "Sno": index + 1,
              "Subject Name": subject.name,
              "Subject Type": subject.subject_type,
              "Total Marks": subject.totalMarks
            };
            
            // Extract marks by type
            subject.types.forEach(type => {
              rowData[type.type] = type.marks;
            });
            
            // Ensure all columns have values
            if (!rowData.Assignment) rowData.Assignment = "N/A";
            if (!rowData.Descriptive) rowData.Descriptive = "N/A";
            if (!rowData.Objective) rowData.Objective = "N/A";
            
            return rowData;
          });
          
          // Add internal type data to result array
          result.push({
            year,
            semester,
            internalType: internalTypeNum,
            columns,
            data
          });
        });
      });
    });
    
    return result;
  };

  // Calculate total backlogs from API data
  const calculateTotalBacklogs = (apiData) => {
    let backlogs = 0;
    
    if (!apiData || !apiData.yearlyResults) return backlogs;
    
    Object.values(apiData.yearlyResults).forEach(yearData => {
      Object.values(yearData).forEach(semesterData => {
        if (semesterData.SGPA && semesterData.SGPA.backlogcount) {
          backlogs += semesterData.SGPA.backlogcount;
        }
      });
    });
    
    return backlogs;
  };

  const handleTabChange = (key) => {
    setSelectedTab(key);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 to-indigo-50 text-gray-900'}`}>
      <Navbar />

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
          </div>
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