import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserCircle2, Calendar, School2, Users2, BarChart3,
  MessageSquare, QrCode, Home, ChevronRight, TrendingUp,
} from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";
import { baseUrl } from "../baseurl";
import LinearProgressBar from "../components/AttendanceTracker";
import Navbar from "./Navbar";
import { useDarkMode } from "./DarkModeContext";
import Modal from "./Modal";
import DashboardLoader from "../Loaders/Dashboard";

function ProfilePage() {
  const { darkMode } = useDarkMode();
  const [profileDetails, setProfileDetails] = useState(null);
  const [profileQRCode, setProfileQRCode] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [attendancePer, setAttendancePer] = useState(0);
  const [twoWeekSessions, setTwoWeekSessions] = useState({ present: 0, absent: 0, nosessions: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [isClubsModalOpen, setIsClubsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const studentId = Cookies.get("id");
      const token = Cookies.get("token");
      if (studentId && token) await fetchProfileData(studentId, token);
      else navigate("/search");
    };
    fetchData();
  }, []);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) fetchAttendanceData(token);
  }, [profileDetails]);

  const fetchProfileData = async (studentId, token) => {
    try {
      const response = await axios.post(
        `${baseUrl}/api/studentprofile`,
        { studentId },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      const payload = response.data.payload || {};
      const student = payload?.student || {};
      const studentimage = payload?.studentimage || null;
      const qrcode = payload?.qrcode || null;
      setProfileDetails({ ...student, studentimage });
      setProfileQRCode(qrcode);
      setIsLoading(false);
    } catch {
      setIsLoading(false);
    }
  };

  const fetchAttendanceData = async (token) => {
    try {
      const response = await axios.post(
        `${baseUrl}/api/attendance`, {},
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      const { dayObjects = [], totalPercentage = 0, twoWeekSessions = { present: 0, absent: 0, nosessions: 0 } } = response.data || {};
      setAttendanceData(dayObjects);
      setAttendancePer(totalPercentage);
      setTwoWeekSessions(twoWeekSessions);
    } catch {}
  };

  const handleNetraQRClick = () => {
    if (profileQRCode) {
      sessionStorage.setItem('netraQRCode', profileQRCode);
      sessionStorage.setItem('studentHallticket', profileDetails?.htno || '');
    }
    navigate("/netraqr");
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen ${darkMode ? "bg-gray-950" : "bg-gray-50"}`}>
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 pt-20 pb-6">
          <DashboardLoader />
        </div>
      </div>
    );
  }

  if (!profileDetails) return null;

  const attendanceColor = attendancePer < 45 ? 'text-red-500' : attendancePer < 75 ? 'text-orange-500' : 'text-emerald-500';
  const attendanceBg = attendancePer < 45
    ? (darkMode ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-100')
    : attendancePer < 75
    ? (darkMode ? 'bg-orange-500/10 border-orange-500/20' : 'bg-orange-50 border-orange-100')
    : (darkMode ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-100');

  const quickActions = [
    { icon: Users2, label: "Clubs", gradient: "from-purple-500 to-pink-500", onClick: () => setIsClubsModalOpen(true) },
    { icon: Calendar, label: "Attendance", gradient: "from-blue-500 to-cyan-500", onClick: () => navigate("/attendance") },
    { icon: BarChart3, label: "Results", gradient: "from-emerald-500 to-teal-500", onClick: () => navigate("/result") },
    { icon: School2, label: "Timetable", gradient: "from-amber-500 to-orange-500", onClick: () => navigate("/timetable") },
    { icon: QrCode, label: "Netra QR", gradient: "from-indigo-500 to-violet-500", onClick: handleNetraQRClick },
    { icon: MessageSquare, label: "Feedback", gradient: "from-rose-500 to-pink-500", onClick: () => navigate("/feedback") },
  ];

  const profileStats = [
    { label: "Section", value: `${profileDetails?.branch?.code || 'N/A'}-${profileDetails?.section?.name || 'N/A'}` },
    { label: "Year", value: profileDetails?.currentyear || 'N/A' },
    { label: "Admitted", value: profileDetails?.admissionyear || 'N/A' },
    { label: "Regulation", value: profileDetails?.regulation?.name || 'N/A' },
  ];

  const card = darkMode ? "bg-gray-900 border-white/5" : "bg-white border-gray-100";

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-950" : "bg-gray-50"}`}>
      <Navbar />

      {/* Sub-nav */}
      <div className={`border-b pt-14 ${darkMode ? "bg-gray-950 border-white/5" : "bg-white border-gray-100"}`}>
        <div className="max-w-5xl mx-auto px-4 h-12 flex items-center justify-between">
          <button
            onClick={() => navigate("/search")}
            className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${darkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"}`}
          >
            <Home className="w-3.5 h-3.5" />
            Home
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">{profileDetails?.name?.[0] || "S"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-5 grid grid-cols-12 gap-4">
        {/* Profile card */}
        <div className="col-span-12 md:col-span-4">
          <div className={`rounded-2xl border p-5 ${card}`}>
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-3">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/30 to-violet-500/30 blur-md" />
                <img
                  src={profileDetails?.studentimage || "/default-profile.png"}
                  alt="Student"
                  className="relative w-20 h-20 rounded-2xl object-cover ring-2 ring-indigo-500/30"
                />
              </div>
              <h2 className={`text-base font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                {profileDetails?.name || "N/A"}
              </h2>
              <p className={`text-xs mt-0.5 font-mono ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                {profileDetails?.htno || "N/A"}
              </p>

              <div className={`w-full mt-4 rounded-xl p-3 space-y-2.5 ${darkMode ? "bg-gray-800/50" : "bg-gray-50"}`}>
                {profileStats.map((stat, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>{stat.label}</span>
                    <span className={`text-xs font-semibold ${darkMode ? "text-gray-200" : "text-gray-700"}`}>{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Attendance card */}
        <div className="col-span-12 md:col-span-8">
          <div className={`rounded-2xl border p-5 h-full ${card}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-sm font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Attendance Overview</h3>
              <button
                onClick={() => navigate("/attendance")}
                className={`flex items-center gap-1 text-xs font-medium text-indigo-500 hover:text-indigo-400 transition-colors`}
              >
                View all <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {/* Overall percentage */}
            <div className={`rounded-xl border p-3.5 mb-4 ${attendanceBg}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className={`w-4 h-4 ${attendanceColor}`} />
                  <span className={`text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Overall</span>
                </div>
                <span className={`text-lg font-bold ${attendanceColor}`}>{attendancePer}%</span>
              </div>
              <LinearProgressBar attendancePer={attendancePer} />
            </div>

            {/* Sessions grid */}
            <div className="grid grid-cols-3 gap-2.5 mb-4">
              {[
                { label: "Present", value: twoWeekSessions?.present || 0, color: "text-emerald-500", bg: darkMode ? "bg-emerald-500/10 border-emerald-500/20" : "bg-emerald-50 border-emerald-100" },
                { label: "Absent", value: twoWeekSessions?.absent || 0, color: "text-red-500", bg: darkMode ? "bg-red-500/10 border-red-500/20" : "bg-red-50 border-red-100" },
                { label: "No Class", value: twoWeekSessions?.nosessions || 0, color: darkMode ? "text-gray-400" : "text-gray-500", bg: darkMode ? "bg-gray-800 border-white/5" : "bg-gray-50 border-gray-100" },
              ].map((s, i) => (
                <div key={i} className={`rounded-xl border p-3 text-center ${s.bg}`}>
                  <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
                  <div className={`text-xs mt-0.5 ${darkMode ? "text-gray-500" : "text-gray-500"}`}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Recent days */}
            <div className="space-y-2">
              <p className={`text-xs font-medium mb-2 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Recent Sessions</p>
              {attendanceData?.slice(0, 5)?.map((day, index) => (
                <div key={index} className={`flex items-center gap-2.5 rounded-xl p-2 ${darkMode ? "bg-gray-800/50" : "bg-gray-50"}`}>
                  <span className={`text-xs font-mono w-16 flex-shrink-0 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{day?.date || "-"}</span>
                  <div className="flex gap-1">
                    {[1,2,3,4,5,6,7].map((period) => (
                      <span
                        key={period}
                        className={`w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-bold ${
                          day.sessions[`period_${period}`] === 1
                            ? "bg-emerald-100 text-emerald-600"
                            : day.sessions[`period_${period}`] === 0
                            ? "bg-red-100 text-red-600"
                            : darkMode ? "bg-gray-700 text-gray-500" : "bg-gray-200 text-gray-400"
                        }`}
                      >
                        {day.sessions[`period_${period}`] === 1 ? "✓" : day.sessions[`period_${period}`] === 0 ? "×" : "–"}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="col-span-12">
          <div className={`rounded-2xl border p-5 ${card}`}>
            <h3 className={`text-sm font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>Quick Actions</h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={index}
                    onClick={action.onClick}
                    className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-200 hover:scale-105 active:scale-95 ${
                      darkMode ? "hover:bg-white/5" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className={`text-xs font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{action.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isClubsModalOpen} onClose={() => setIsClubsModalOpen(false)} title="Club Details" type="info">
        <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Club details will be updated soon.</p>
      </Modal>
    </div>
  );
}

export default ProfilePage;
