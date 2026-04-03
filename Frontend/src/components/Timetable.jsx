import React, { useState, useEffect } from "react";
import axios from "axios";
import { Parser } from "html-to-react";
import { BookOpen, Clock, Calendar, Sun, Sunset } from "lucide-react";
import Cookies from "js-cookie";
import { baseUrl } from "../baseurl";
import Navbar from "./Navbar";
import { useDarkMode } from "./DarkModeContext";
import Loader from "./Loader";

function Timetable() {
  const { darkMode } = useDarkMode();
  const [loading, setLoading] = useState(false);
  const [timetableData, setTimetableData] = useState([]);
  const [selectedDay, setSelectedDay] = useState("Monday");
  const parser = new Parser();

  useEffect(() => {
    const storedToken = Cookies.get("token");
    if (storedToken) fetchData(storedToken);
  }, []);

  const fetchData = async (currentToken) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/api/timetable`,
        { method: "317" },
        { headers: { Authorization: `Bearer ${currentToken}` } }
      );
      let timetable = response.data.timetable;
      if (timetable) {
        const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        setTimetableData(daysOfWeek.map(day =>
          timetable.find(item => item.dayname === day) || { dayname: day, beforelunch: [], lunch: "", afterlunch: [] }
        ));
      } else {
        setTimetableData([]);
      }
    } catch {}
    finally { setLoading(false); }
  };

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayShort = { Monday: "Mon", Tuesday: "Tue", Wednesday: "Wed", Thursday: "Thu", Friday: "Fri", Saturday: "Sat" };
  const currentDay = timetableData.find(d => d.dayname === selectedDay);

  const card = darkMode ? "bg-gray-900 border-white/5" : "bg-white border-gray-100";

  const SessionCard = ({ session, index }) => (
    <div className={`flex items-center gap-3 rounded-xl p-3.5 border transition-all duration-150 ${
      darkMode ? "bg-gray-800/50 border-white/5 hover:border-indigo-500/30" : "bg-gray-50 border-gray-100 hover:border-indigo-200"
    }`}>
      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 flex items-center justify-center flex-shrink-0">
        <span className={`text-xs font-bold ${darkMode ? "text-indigo-400" : "text-indigo-600"}`}>{index + 1}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold truncate ${darkMode ? "text-white" : "text-gray-900"}`}>
          {session.subject}
        </p>
        <p className={`text-xs mt-0.5 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
          {parser.parse(session.hour)}
        </p>
      </div>
      <BookOpen className={`w-4 h-4 flex-shrink-0 ${darkMode ? "text-gray-600" : "text-gray-300"}`} />
    </div>
  );

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-950" : "bg-gray-50"}`}>
      <Navbar />

      <div className={`border-b pt-14 ${darkMode ? "bg-gray-950 border-white/5" : "bg-white border-gray-100"}`}>
        <div className="max-w-3xl mx-auto px-4 h-12 flex items-center gap-2">
          <Calendar className={`w-4 h-4 ${darkMode ? "text-indigo-400" : "text-indigo-600"}`} />
          <h1 className={`text-sm font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Class Timetable</h1>
        </div>
      </div>

      {/* Day tabs */}
      <div className={`sticky top-14 z-10 border-b ${darkMode ? "bg-gray-950/90 border-white/5" : "bg-white/90 border-gray-100"}`}
        style={{ backdropFilter: 'blur(12px)' }}>
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex gap-1 py-2 overflow-x-auto scrollbar-hide">
            {days.map(day => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  selectedDay === day
                    ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/30"
                    : darkMode
                    ? "text-gray-400 hover:bg-white/5 hover:text-white"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {dayShort[day]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-5">
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <Loader size="md" label="Loading timetable..." />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Morning */}
            <div className={`rounded-2xl border overflow-hidden ${card}`}>
              <div className={`px-4 py-3 border-b flex items-center gap-2 ${darkMode ? "border-white/5 bg-gray-800/30" : "border-gray-50 bg-gray-50/80"}`}>
                <Sun className={`w-4 h-4 ${darkMode ? "text-amber-400" : "text-amber-500"}`} />
                <h2 className={`text-xs font-bold ${darkMode ? "text-gray-200" : "text-gray-700"}`}>Morning Sessions</h2>
              </div>
              <div className="p-3 space-y-2">
                {currentDay?.beforelunch?.length > 0
                  ? currentDay.beforelunch.map((session, i) => <SessionCard key={i} session={session} index={i} />)
                  : <p className={`text-xs text-center py-4 ${darkMode ? "text-gray-600" : "text-gray-400"}`}>No morning sessions</p>
                }
              </div>
            </div>

            {/* Lunch */}
            <div className={`rounded-2xl border px-4 py-3 flex items-center gap-3 ${
              darkMode ? "bg-gray-900 border-white/5" : "bg-amber-50 border-amber-100"
            }`}>
              <Clock className={`w-4 h-4 ${darkMode ? "text-amber-400" : "text-amber-500"}`} />
              <div>
                <p className={`text-xs font-semibold ${darkMode ? "text-gray-300" : "text-amber-800"}`}>Lunch Break</p>
                <p className={`text-xs ${darkMode ? "text-gray-500" : "text-amber-600"}`}>{currentDay?.lunch || "—"}</p>
              </div>
            </div>

            {/* Afternoon */}
            <div className={`rounded-2xl border overflow-hidden ${card}`}>
              <div className={`px-4 py-3 border-b flex items-center gap-2 ${darkMode ? "border-white/5 bg-gray-800/30" : "border-gray-50 bg-gray-50/80"}`}>
                <Sunset className={`w-4 h-4 ${darkMode ? "text-orange-400" : "text-orange-500"}`} />
                <h2 className={`text-xs font-bold ${darkMode ? "text-gray-200" : "text-gray-700"}`}>Afternoon Sessions</h2>
              </div>
              <div className="p-3 space-y-2">
                {currentDay?.afterlunch?.length > 0
                  ? currentDay.afterlunch.map((session, i) => <SessionCard key={i} session={session} index={i} />)
                  : <p className={`text-xs text-center py-4 ${darkMode ? "text-gray-600" : "text-gray-400"}`}>No afternoon sessions</p>
                }
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Timetable;
