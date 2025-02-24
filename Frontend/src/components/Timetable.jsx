// src/components/Timetable.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Parser } from "html-to-react";
import { BookOpen, Clock, Calendar } from "lucide-react";
import Cookies from "js-cookie";
import { baseUrl } from "../baseurl";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar"; // Import the Navbar component
import { useDarkMode } from "./DarkModeContext"; // Import the dark mode hook

function Timetable() {
  const { darkMode } = useDarkMode(); // Access dark mode state
  const [loading, setLoading] = useState(false);
  const [timetableData, setTimetableData] = useState([]);
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [token, setToken] = useState(null);
  const parser = new Parser();
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve token from cookies
    const storedToken = Cookies.get("token");
    if (storedToken) {
      setToken(storedToken);
      fetchData(storedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchData(token);
    }
  }, [token]);

  const fetchData = async (currentToken) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/api/timetable`,
        { method: "317" },
        {
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        }
      );
      let updatedTimetable;
      let timetable = response.data.timetable;
      if (timetable !== null) {
        const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        updatedTimetable = daysOfWeek.map((day) => {
          const dayData = timetable.find((item) => item.dayname === day);
          return dayData || { dayname: day, beforelunch: [], lunch: "", afterlunch: [] };
        });
      } else {
        updatedTimetable = [];
      }
      setTimetableData(updatedTimetable);
    } catch (error) {
      console.error("Error fetching timetable:", error);
    } finally {
      setLoading(false);
    }
  };

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-slate-50"}`}>
      {/* Add the Navbar */}
      <Navbar />

      {/* Header */}
      <header className={`${darkMode ? "bg-gray-800" : "bg-white"} shadow-sm sticky top-16 z-10 mt-16`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Calendar className={`h-6 w-6 sm:h-8 sm:w-8 ${darkMode ? "text-indigo-400" : "text-indigo-600"}`} />
              <h1 className={`text-lg sm:text-xl font-bold ${darkMode ? "text-gray-200" : "text-slate-800"}`}>
                Class Timetable
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Day Selection Tabs */}
        <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl shadow-sm border ${
          darkMode ? "border-gray-700" : "border-slate-200"
        } mb-6 sticky top-[73px] sm:top-[81px] z-10`}>
          <div className="flex overflow-x-auto scrollbar-hide">
            {days.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`flex-1 min-w-[100px] px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedDay === day
                    ? darkMode
                      ? "text-indigo-400 border-b-2 border-indigo-400 bg-indigo-900/20"
                      : "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50"
                    : darkMode
                    ? "text-gray-300 hover:text-gray-100 hover:bg-gray-700"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${
              darkMode ? "border-indigo-400" : "border-indigo-600"
            } mx-auto`}></div>
            <p className={`mt-4 ${darkMode ? "text-gray-300" : "text-slate-600"}`}>Loading timetable...</p>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {/* Morning Sessions */}
            <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl shadow-sm border ${
              darkMode ? "border-gray-700" : "border-slate-200"
            }`}>
              <div className={`p-4 sm:p-6 border-b ${darkMode ? "border-gray-700" : "border-slate-200"}`}>
                <div className="flex items-center space-x-2">
                  <Clock className={`h-5 w-5 ${darkMode ? "text-indigo-400" : "text-indigo-600"}`} />
                  <h2 className={`text-base sm:text-lg font-semibold ${darkMode ? "text-gray-200" : "text-slate-800"}`}>
                    Morning Sessions
                  </h2>
                </div>
              </div>
              <div className={`divide-y ${darkMode ? "divide-gray-700" : "divide-slate-200"}`}>
                {timetableData?.find((d) => d.dayname === selectedDay)?.beforelunch.map((session, index) => (
                  <div
                    key={index}
                    className={`p-3 sm:p-4 ${darkMode ? "hover:bg-gray-700" : "hover:bg-slate-50"} transition-colors`}
                  >
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className={`h-8 w-8 sm:h-10 sm:w-10 rounded-full ${
                        darkMode ? "bg-indigo-900/20" : "bg-indigo-50"
                      } flex items-center justify-center flex-shrink-0`}>
                        <BookOpen className={`h-4 w-4 sm:h-5 sm:w-5 ${darkMode ? "text-indigo-400" : "text-indigo-600"}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className={`font-medium ${darkMode ? "text-gray-200" : "text-slate-900"} text-sm sm:text-base truncate`}>
                          {session.subject}
                        </h3>
                        <p className={`text-xs sm:text-sm ${darkMode ? "text-gray-400" : "text-slate-500"} mt-0.5`}>
                          {parser.parse(session.hour)} {/* Parse HTML content */}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Lunch Break */}
            <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl shadow-sm border ${
              darkMode ? "border-gray-700" : "border-slate-200"
            } p-3 sm:p-4`}>
              <div className={`flex items-center justify-center space-x-2 ${
                darkMode ? "text-gray-300" : "text-slate-600"
              }`}>
                <Clock className={`h-4 w-4 sm:h-5 sm:w-5 ${darkMode ? "text-gray-300" : "text-slate-600"}`} />
                <span className={`font-medium text-sm sm:text-base ${
                  darkMode ? "text-gray-300" : "text-slate-600"
                }`}>
                  Lunch Break: {timetableData?.find((d) => d.dayname === selectedDay)?.lunch}
                </span>
              </div>
            </div>

            {/* Afternoon Sessions */}
            <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl shadow-sm border ${
              darkMode ? "border-gray-700" : "border-slate-200"
            }`}>
              <div className={`p-4 sm:p-6 border-b ${darkMode ? "border-gray-700" : "border-slate-200"}`}>
                <div className="flex items-center space-x-2">
                  <Clock className={`h-5 w-5 ${darkMode ? "text-indigo-400" : "text-indigo-600"}`} />
                  <h2 className={`text-base sm:text-lg font-semibold ${darkMode ? "text-gray-200" : "text-slate-800"}`}>
                    Afternoon Sessions
                  </h2>
                </div>
              </div>
              <div className={`divide-y ${darkMode ? "divide-gray-700" : "divide-slate-200"}`}>
                {timetableData?.find((d) => d.dayname === selectedDay)?.afterlunch.map((session, index) => (
                  <div
                    key={index}
                    className={`p-3 sm:p-4 ${darkMode ? "hover:bg-gray-700" : "hover:bg-slate-50"} transition-colors`}
                  >
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className={`h-8 w-8 sm:h-10 sm:w-10 rounded-full ${
                        darkMode ? "bg-indigo-900/20" : "bg-indigo-50"
                      } flex items-center justify-center flex-shrink-0`}>
                        <BookOpen className={`h-4 w-4 sm:h-5 sm:w-5 ${darkMode ? "text-indigo-400" : "text-indigo-600"}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className={`font-medium ${darkMode ? "text-gray-200" : "text-slate-900"} text-sm sm:text-base truncate`}>
                          {session.subject}
                        </h3>
                        <p className={`text-xs sm:text-sm ${darkMode ? "text-gray-400" : "text-slate-500"} mt-0.5`}>
                          {parser.parse(session.hour)} {/* Parse HTML content */}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Timetable;