// src/components/AttendancePage.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { BookOpen, GraduationCap, UserCircle, ArrowLeft } from "lucide-react";
import { baseUrl } from "../baseurl";
import Navbar from "./Navbar";
import { useDarkMode } from "./DarkModeContext"; // Import the dark mode hook

function AttendancePage() {
  const { darkMode } = useDarkMode(); // Access dark mode state
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve token from cookies
    const storedToken = Cookies.get("token");
    if (storedToken) {
      setToken(storedToken);
      fetchAttendanceData(storedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchAttendanceData(token);
    }
  }, [token]);

  const fetchAttendanceData = async (token) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/api/subject/attendance`,
        { method: "314" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data;
      console.log(data);
      setAttendanceData(data);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressColor = (percentage) => {
    if (percentage <= 45) return darkMode ? "bg-red-600" : "bg-red-500"; // Red for 0-45%
    if (percentage <= 65) return darkMode ? "bg-orange-600" : "bg-orange-500"; // Orange for 46-65%
    return darkMode ? "bg-green-600" : "bg-green-500"; // Green for 66% and above
  };

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"} font-sans`}>
      <Navbar />
      <header className={`${darkMode ? "bg-gray-800" : "bg-white"} shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Go Back Button */}
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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Attendance Overview */}
        <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow`}>
          <div className={`px-6 py-4 border-b ${
            darkMode ? "border-gray-700" : "border-gray-200"
          }`}>
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
            ) : (
              <div className="space-y-6">
                {attendanceData.map((subject) => (
                  <div
                    key={subject.subjectname}
                    className={`${darkMode ? "bg-gray-700" : "bg-gray-50"} rounded-lg p-4 shadow-sm`}
                  >
                    <h3 className={`text-sm font-medium ${
                      darkMode ? "text-gray-200" : "text-gray-900"
                    } mb-3`}>
                      {subject.subjectname}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className={`text-xs font-medium ${
                            darkMode ? "text-gray-300" : "text-gray-700"
                          }`}>
                            Theory
                          </span>
                          <span className={`text-xs font-medium ${
                            darkMode ? "text-gray-300" : "text-gray-700"
                          }`}>
                            {subject.percentage}%
                          </span>
                        </div>
                        <div className={`w-full ${
                          darkMode ? "bg-gray-600" : "bg-gray-200"
                        } rounded-full h-2 overflow-hidden`}>
                          <div
                            className={`${getProgressColor(parseFloat(subject.percentage))} h-2 rounded-full transition-all duration-1000 ease-in-out`}
                            style={{ width: `${subject.percentage}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className={`text-xs font-medium ${
                            darkMode ? "text-gray-300" : "text-gray-700"
                          }`}>
                            Practical
                          </span>
                          <span className={`text-xs font-medium ${
                            darkMode ? "text-gray-300" : "text-gray-700"
                          }`}>
                            {subject.practical}%
                          </span>
                        </div>
                        <div className={`w-full ${
                          darkMode ? "bg-gray-600" : "bg-gray-200"
                        } rounded-full h-2 overflow-hidden`}>
                          <div
                            className={`${getProgressColor(parseFloat(subject.practical))} h-2 rounded-full transition-all duration-1000 ease-in-out`}
                            style={{ width: `${subject.practical}%` }}
                          />
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