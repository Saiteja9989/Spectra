import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { BookOpen, GraduationCap, UserCircle, ArrowLeft, Calendar } from "lucide-react";
import { baseUrl } from "../baseurl";
import Navbar from "./Navbar";
import { useDarkMode } from "./DarkModeContext";

function AttendancePage() {
  const { darkMode } = useDarkMode();
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = Cookies.get("token");
    if (storedToken) {
      setToken(storedToken);
      fetchAttendanceData(storedToken);
    }
  }, []);

  const fetchAttendanceData = async (token) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/api/subject/attendance`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      setAttendanceData(response.data);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressColor = (percentage) => {
    const percent = parseFloat(percentage);
    if (percent <= 45) return darkMode ? "bg-red-600" : "bg-red-500";
    if (percent <= 65) return darkMode ? "bg-orange-600" : "bg-orange-500";
    return darkMode ? "bg-green-600" : "bg-green-500";
  };

  const getStatusText = (percentage) => {
    const percent = parseFloat(percentage);
    if (percent <= 45) return "Low";
    if (percent <= 65) return "Moderate";
    return "Good";
  };

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"} font-sans`}>
      <Navbar />
      <header className={`${darkMode ? "bg-gray-800" : "bg-white"} shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate("/user")}
                className={`flex items-center space-x-2 ${
                  darkMode ? "text-gray-300 hover:text-indigo-400" : "text-gray-600 hover:text-indigo-600"
                } transition-colors`}
              >
                <ArrowLeft className="h-6 w-6" />
                <span className="text-sm font-medium">Go Back</span>
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className={`h-5 w-5 ${darkMode ? "text-indigo-400" : "text-indigo-600"}`} />
              <h1 className={`text-lg font-semibold ${darkMode ? "text-gray-200" : "text-gray-900"}`}>
                Subject Attendance
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow`}>
          <div className={`px-6 py-4 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
            <div className="flex items-center space-x-2">
              <BookOpen className={`h-5 w-5 ${darkMode ? "text-indigo-400" : "text-indigo-600"}`} />
              <h2 className={`text-lg font-semibold ${darkMode ? "text-gray-200" : "text-gray-900"}`}>
                Attendance Overview
              </h2>
            </div>
          </div>

          <div className="px-6 py-4">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className={`animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 ${
                  darkMode ? "border-indigo-400" : "border-indigo-600"
                }`}></div>
              </div>
            ) : attendanceData.length === 0 ? (
              <div className="flex justify-center items-center h-32">
                <p className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  No attendance data available
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {attendanceData.map((subject, index) => (
                  <div
                    key={index}
                    className={`${darkMode ? "bg-gray-700" : "bg-gray-50"} rounded-lg p-6 shadow-sm`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className={`text-lg font-semibold ${
                          darkMode ? "text-gray-200" : "text-gray-900"
                        } mb-1`}>
                          {subject.subjectname}
                        </h3>
                        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                          {subject.subjectType} • {subject.attendedSessions}/{subject.totalSessions} sessions
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        parseFloat(subject.percentage) <= 45 ? 
                          (darkMode ? "bg-red-900 text-red-200" : "bg-red-100 text-red-800") :
                        parseFloat(subject.percentage) <= 65 ? 
                          (darkMode ? "bg-orange-900 text-orange-200" : "bg-orange-100 text-orange-800") :
                          (darkMode ? "bg-green-900 text-green-200" : "bg-green-100 text-green-800")
                      }`}>
                        {getStatusText(subject.percentage)}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className={`text-sm font-medium ${
                            darkMode ? "text-gray-300" : "text-gray-700"
                          }`}>
                            Attendance Percentage
                          </span>
                          <span className={`text-sm font-semibold ${
                            parseFloat(subject.percentage) <= 45 ? "text-red-600" :
                            parseFloat(subject.percentage) <= 65 ? "text-orange-600" :
                            "text-green-600"
                          }`}>
                            {subject.percentage}%
                          </span>
                        </div>
                        <div className={`w-full ${
                          darkMode ? "bg-gray-600" : "bg-gray-200"
                        } rounded-full h-3 overflow-hidden`}>
                          <div
                            className={`${getProgressColor(subject.percentage)} h-3 rounded-full transition-all duration-1000 ease-in-out`}
                            style={{ width: `${subject.percentage}%` }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className={`${darkMode ? "bg-gray-600" : "bg-gray-100"} rounded-lg p-3`}>
                          <div className={`font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                            Attended
                          </div>
                          <div className={`text-lg font-bold ${
                            darkMode ? "text-green-400" : "text-green-600"
                          }`}>
                            {subject.attendedSessions}
                          </div>
                        </div>
                        <div className={`${darkMode ? "bg-gray-600" : "bg-gray-100"} rounded-lg p-3`}>
                          <div className={`font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                            Total Sessions
                          </div>
                          <div className={`text-lg font-bold ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
                            {subject.totalSessions}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default AttendancePage;