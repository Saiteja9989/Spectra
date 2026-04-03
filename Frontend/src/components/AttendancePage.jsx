import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { BookOpen, Calendar } from "lucide-react";
import { baseUrl } from "../baseurl";
import Navbar from "./Navbar";
import { useDarkMode } from "./DarkModeContext";
import Loader from "./Loader";

function AttendancePage() {
  const { darkMode } = useDarkMode();
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = Cookies.get("token");
    if (storedToken) fetchAttendanceData(storedToken);
  }, []);

  const fetchAttendanceData = async (token) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/api/subject/attendance`, {},
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      setAttendanceData(response.data);
    } catch {}
    finally { setLoading(false); }
  };

  const getStatus = (percentage) => {
    const p = parseFloat(percentage);
    if (p <= 45) return { label: "Low", color: "text-red-500", bg: darkMode ? "bg-red-500/10 border-red-500/20" : "bg-red-50 border-red-100", bar: "#ef4444" };
    if (p <= 65) return { label: "Moderate", color: "text-orange-500", bg: darkMode ? "bg-orange-500/10 border-orange-500/20" : "bg-orange-50 border-orange-100", bar: "#f97316" };
    return { label: "Good", color: "text-emerald-500", bg: darkMode ? "bg-emerald-500/10 border-emerald-500/20" : "bg-emerald-50 border-emerald-100", bar: "#22c55e" };
  };

  const card = darkMode ? "bg-gray-900 border-white/5" : "bg-white border-gray-100";

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-950" : "bg-gray-50"}`}>
      <Navbar />

      <div className={`border-b pt-14 ${darkMode ? "bg-gray-950 border-white/5" : "bg-white border-gray-100"}`}>
        <div className="max-w-3xl mx-auto px-4 h-12 flex items-center gap-2">
          <Calendar className={`w-4 h-4 ${darkMode ? "text-indigo-400" : "text-indigo-600"}`} />
          <h1 className={`text-sm font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Subject Attendance</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-5">
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <Loader size="md" label="Loading attendance..." />
          </div>
        ) : attendanceData.length === 0 ? (
          <div className={`rounded-2xl border p-12 text-center ${card}`}>
            <BookOpen className={`w-8 h-8 mx-auto mb-3 ${darkMode ? "text-gray-600" : "text-gray-300"}`} />
            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>No attendance data available</p>
          </div>
        ) : (
          <div className="space-y-3">
            {attendanceData.map((subject, index) => {
              const status = getStatus(subject.percentage);
              const pct = parseFloat(subject.percentage);
              return (
                <div key={index} className={`rounded-2xl border p-4 ${card}`}>
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-sm font-bold truncate ${darkMode ? "text-white" : "text-gray-900"}`}>
                        {subject.subjectname}
                      </h3>
                      <p className={`text-xs mt-0.5 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                        {subject.subjectType}
                      </p>
                    </div>
                    <span className={`flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full border ${status.bg} ${status.color}`}>
                      {status.label}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Attendance</span>
                      <span className={`text-sm font-bold ${status.color}`}>{subject.percentage}%</span>
                    </div>
                    <div className={`w-full h-2 rounded-full overflow-hidden ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
                      <div
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${status.bar}cc, ${status.bar})` }}
                      />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className={`rounded-xl p-3 ${darkMode ? "bg-gray-800/60" : "bg-gray-50"}`}>
                      <div className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Attended</div>
                      <div className="text-lg font-bold text-emerald-500">{subject.attendedSessions}</div>
                    </div>
                    <div className={`rounded-xl p-3 ${darkMode ? "bg-gray-800/60" : "bg-gray-50"}`}>
                      <div className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Total Sessions</div>
                      <div className={`text-lg font-bold ${darkMode ? "text-indigo-400" : "text-indigo-600"}`}>{subject.totalSessions}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default AttendancePage;
