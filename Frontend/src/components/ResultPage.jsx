import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import InternalResultComponent from "./InternalResultComponent";
import ExternalResultComponent from "./ExternalResultComponent";
import { baseUrl } from "../baseurl";
import { BookOpen, GraduationCap } from "lucide-react";
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
      setIsLoading(false);
    }
  }, []);

  const fetchExternalResultData = async (token, rollno) => {
    try {
      const response = await axios.post(`${baseUrl}/api/externalResultData`, { rollno }, { headers: { Authorization: `Bearer ${token}` } });
      if (response.data.Error) return;
      setExternalResultData(transformApiData(response.data.payload));
      setTotalBacklogs(calculateTotalBacklogs(response.data.payload));
    } catch (error) {
      if (error.response?.status === 401) navigate('/login');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchInternalResultData = async (token, rollno) => {
    try {
      const response = await axios.post(`${baseUrl}/api/internalResultData`, { rollno }, { headers: { Authorization: `Bearer ${token}` } });
      if (response.data.Error) return;
      setInternalResultData(transformInternalApiData(response.data.payload));
    } catch (error) {
      if (error.response?.status === 401) navigate('/login');
    }
  };

  const transformApiData = (apiData) => {
    const result = [];
    if (!apiData?.yearlyResults) return result;
    Object.entries(apiData.yearlyResults).forEach(([yearKey, yearData]) => {
      const year = parseInt(yearKey.split(" ")[1]);
      Object.entries(yearData).forEach(([semesterKey, semesterData]) => {
        const semester = parseInt(semesterKey.split(" ")[1]);
        const columns = ["Sno", "Subject Name", "Grade", "Grade Points", "Credits"];
        const data = semesterData.results.map((subject, index) => ({
          "Sno": index + 1,
          "Subject Name": subject.subjectName,
          "Grade": subject.grade,
          "Grade Points": subject.gradepoints,
          "Credits": subject.credits
        }));
        result.push({ year, semester, columns, data, creditsAcquired: semesterData.SGPA?.totalCredits || "N/A", sgpa: semesterData.SGPA?.sgpa || "N/A" });
      });
    });
    return result;
  };

  const transformInternalApiData = (apiData) => {
    const result = [];
    if (!apiData || !Array.isArray(apiData)) return result;
    apiData.forEach(yearData => {
      const year = parseInt(yearData.year);
      yearData.semesters.forEach(semesterData => {
        const semester = parseInt(semesterData.semester);
        semesterData.internal_types.forEach(internalType => {
          const internalTypeNum = parseInt(internalType.internalType);
          const columns = ["Sno", "Subject Name", "Subject Type", "Total Marks", "Assignment", "Descriptive", "Objective"];
          const data = internalType.subjects.map((subject, index) => {
            const rowData = { "Sno": index + 1, "Subject Name": subject.name, "Subject Type": subject.subject_type, "Total Marks": subject.totalMarks };
            subject.types.forEach(type => { rowData[type.type] = type.marks; });
            if (!rowData.Assignment) rowData.Assignment = "N/A";
            if (!rowData.Descriptive) rowData.Descriptive = "N/A";
            if (!rowData.Objective) rowData.Objective = "N/A";
            return rowData;
          });
          result.push({ year, semester, internalType: internalTypeNum, columns, data });
        });
      });
    });
    return result;
  };

  const calculateTotalBacklogs = (apiData) => {
    let backlogs = 0;
    if (!apiData?.yearlyResults) return backlogs;
    Object.values(apiData.yearlyResults).forEach(yearData => {
      Object.values(yearData).forEach(semesterData => {
        if (semesterData.SGPA?.backlogcount) backlogs += semesterData.SGPA.backlogcount;
      });
    });
    return backlogs;
  };

  const card = darkMode ? "bg-gray-900 border-white/5" : "bg-white border-gray-100";
  const tabs = [
    { key: "internal", label: "Internal Assessment", icon: BookOpen },
    { key: "external", label: "Semester Results", icon: GraduationCap },
  ];

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-950" : "bg-gray-50"}`}>
      <Navbar />

      <div className={`border-b pt-14 ${darkMode ? "bg-gray-950 border-white/5" : "bg-white border-gray-100"}`}>
        <div className="max-w-4xl mx-auto px-4 h-12 flex items-center gap-2">
          <GraduationCap className={`w-4 h-4 ${darkMode ? "text-indigo-400" : "text-indigo-600"}`} />
          <h1 className={`text-sm font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Academic Results</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-5">
        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <Loader size="md" label="Loading results..." />
          </div>
        ) : (
          <div className={`rounded-2xl border overflow-hidden ${card}`}>
            {/* Tab bar */}
            <div className={`flex border-b ${darkMode ? "border-white/5" : "border-gray-100"}`}>
              {tabs.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setSelectedTab(key)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-xs font-semibold transition-all duration-200 relative ${
                    selectedTab === key
                      ? darkMode ? "text-indigo-400" : "text-indigo-600"
                      : darkMode ? "text-gray-500 hover:text-gray-300" : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                  {selectedTab === key && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-violet-500" />
                  )}
                </button>
              ))}
            </div>

            <div className="p-4">
              {selectedTab === "internal"
                ? <InternalResultComponent resultData={internalResultData} darkMode={darkMode} />
                : <ExternalResultComponent resultData={externalResultData} totalBacklogs={totalBacklogs} darkMode={darkMode} />
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultPage;
