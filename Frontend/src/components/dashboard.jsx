import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserCircle2,
  Calendar,
  School2,
  Users2,
  BarChart3,
  MessageSquare,
  QrCode,
  Bell,
  Home,
} from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { baseUrl } from "../baseurl";
import LinearProgressBar from "../components/AttendanceTracker";
import Navbar from "./Navbar";
import { useDarkMode } from "./DarkModeContext";
import Modal from "./Modal";
import { Spin } from "antd"; // Import Spin component from Ant Design

function ProfilePage() {
  const { darkMode } = useDarkMode(); // Access dark mode state
  const [profileDetails, setProfileDetails] = useState(null);
  const [attendanceData, setAttendanceData] = useState(null);
  const [attendancePer, setAttendancePer] = useState(0);
  const [twoWeekSessions, setTwoWeekSessions] = useState(0);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [isClubsModalOpen, setIsClubsModalOpen] = useState(false);
  const [clubsModalContent, setClubsModalContent] = useState(null);
 useEffect(() => {
  const fetchData = async () => {
    const storedToken = Cookies.get("token");
    if (storedToken) {
      setToken(storedToken);
      await fetchProfileData(storedToken);
    } else {
      navigate("/search");
    }
  };

  fetchData();
}, []);
useEffect(() => {
  if (profileDetails && profileDetails.phone) {
    const storedToken = Cookies.get("token");
    if (storedToken) {
      fetchAttendanceData(storedToken);
    }
  }
}, [profileDetails]);


  const fetchProfileData = async (token) => {
    try {
      const response = await axios.post(
        `${baseUrl}/api/profile`,
        { method: "32" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfileDetails(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching profile data:", error);
      setIsLoading(false);
    }
  };

  const fetchAttendanceData = async (token) => {
    try {
      // console.log(profileDetails);
      const response = await axios.post(
        `${baseUrl}/api/attendance`,
        { method: "314", tar:profileDetails.phone},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const { dayObjects, totalPercentage, twoWeekSessions } = response.data;
      setAttendanceData(dayObjects);
      setAttendancePer(totalPercentage);
      setTwoWeekSessions(twoWeekSessions);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      setIsLoading(false);
    }
  };

  const handleClubsClick = () => {
    setClubsModalContent(
      <p className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}>
        Club details will be updated soon.
      </p>
    );
    setIsClubsModalOpen(true);
  };

  const handleHomeRedirect = () => {
    navigate("/search");
  };

  if (isLoading) {
    return (
      <div className={`flex justify-center items-center h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
         <div className="flex justify-center items-center h-32">
                <div className={`animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 ${
                  darkMode ? "border-indigo-400" : "border-indigo-600"
                }`}></div>
              </div>
      </div>
    );
  }

  if (!profileDetails) {
    return (
      <div className={`flex justify-center items-center h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        {/* <p className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}>No profile data available.</p> */}
      </div>
    );
  }

  const quickActions = [
    {
      icon: Users2,
      label: "Clubs",
      color: "bg-purple-100 text-purple-600",
      onClick: handleClubsClick,
    },
    {
      icon: Calendar,
      label: "Attendance",
      color: "bg-blue-100 text-blue-600",
      onClick: () => navigate("/attendance"),
    },
    {
      icon: BarChart3,
      label: "Results",
      color: "bg-green-100 text-green-600",
      onClick: () => navigate("/result"),
    },
    {
      icon: School2,
      label: "Timetable",
      color: "bg-yellow-100 text-yellow-600",
      onClick: () => navigate("/timetable"),
    },
    {
      icon: QrCode,
      label: "Netra QR",
      color: "bg-indigo-100 text-indigo-600",
      onClick: () => navigate("/netraqr"),
    },
    {
      icon: MessageSquare,
      label: "Feedback",
      color: "bg-pink-100 text-pink-600",
      onClick: () => navigate("/feedback"),
    },
  ];

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <Navbar />
      <nav className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border-b`}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex justify-between h-14 items-center">
            <div className="flex items-center gap-4">
              {/* Home Button */}
              <button
                onClick={handleHomeRedirect}
                className={`flex items-center gap-2 p-2 ${
                  darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                } rounded-lg transition-colors`}
              >
                <Home className={`h-5 w-5 ${darkMode ? "text-gray-300" : "text-gray-500"}`} />
                <span className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Home</span>
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button className={`p-1.5 ${
                darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
              } rounded-full`}>
                <Bell className={`h-4 w-4 ${darkMode ? "text-gray-300" : "text-gray-500"}`} />
              </button>
              <div className="h-7 w-7 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-medium">
                  {profileDetails.firstname[0]}
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-4">
          {/* Profile Summary */}
          <div className="col-span-12 md:col-span-4">
            <div className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"} rounded-xl shadow-sm p-4 border`}>
              <div className="flex flex-col items-center">
                <div className="relative">
                  {/* Student's Photo */}
                  <img
                    src={profileDetails.parentemail=="Valid"?profileDetails.picture:`data:image/jpeg;base64,${profileDetails.picture}`}
                    alt="Student"
                    className="w-24 h-24 rounded-xl object-cover"
                  />
                </div>
                <h2 className={`mt-3 text-base font-semibold ${darkMode ? "text-gray-200" : "text-gray-900"}`}>
                  {profileDetails.firstname}
                </h2>
                <p className={`${darkMode ? "text-gray-400" : "text-gray-500"} text-xs`}>
                  {profileDetails.hallticketno}
                </p>

                <div className="mt-4 w-full space-y-2">
                  <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                    <span className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-xs`}>Department</span>
                    <span className={`font-medium ${darkMode ? "text-gray-200" : "text-gray-900"} text-sm`}>
                      {profileDetails.dept}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                    <span className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-xs`}>Section</span>
                    <span className={`font-medium ${darkMode ? "text-gray-200" : "text-gray-900"} text-sm`}>
                      {profileDetails.section}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                    <span className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-xs`}>Current Year</span>
                    <span className={`font-medium ${darkMode ? "text-gray-200" : "text-gray-900"} text-sm`}>
                      {profileDetails.currentyear}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-xs`}>
                      Year of Admission
                    </span>
                    <span className={`font-medium ${darkMode ? "text-gray-200" : "text-gray-900"} text-sm`}>
                      {profileDetails.yearofadmision}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Attendance Overview */}
          <div className="col-span-12 md:col-span-8">
            <div className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"} rounded-xl shadow-sm p-4 border`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-base font-semibold ${darkMode ? "text-gray-200" : "text-gray-900"}`}>
                  Attendance Overview
                </h3>
              </div>

              {/* Animated Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-1.5">
                  <span className={`text-xs font-medium ${darkMode ? "text-gray-400" : "text-gray-700"}`}>
                    Overall Attendance
                  </span>
                  <div className="px-3 py-1.5 bg-blue-50 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-blue-600">
                      {attendancePer}%
                    </span>
                  </div>
                </div>
                {/* Progress Bar */}
                <LinearProgressBar attendancePer={attendancePer} />
              </div>

              {/* Recent Sessions */}
              <div className="space-y-3">
                <h4 className={`text-xs font-medium ${darkMode ? "text-gray-400" : "text-gray-700"} mb-2`}>
                  Recent Sessions
                </h4>
                {attendanceData?.slice(0, 8).map((day, index) => (
                  <div
                    key={index}
                    className={`flex items-center ${
                      darkMode ? "bg-gray-700" : "bg-gray-50"
                    } rounded-lg p-2`}
                  >
                    <div className={`w-20 text-xs ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{day.date}</div>
                    <div className="flex gap-1.5">
                      {Object.values(day.sessions).map((session, idx) => (
                        <span
                          key={idx}
                          className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs ${
                            parseInt(session) === 1
                              ? "bg-green-100 text-green-600"
                              : parseInt(session) === 0
                              ? "bg-red-100 text-red-600"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {parseInt(session) === 1
                            ? "✓"
                            : parseInt(session) === 0
                            ? "×"
                            : "-"}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-100">
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="text-lg font-semibold text-green-600">
                    {twoWeekSessions.present}
                  </div>
                  <div className="text-xs text-green-700">Present</div>
                </div>
                <div className="bg-red-50 rounded-lg p-3">
                  <div className="text-lg font-semibold text-red-600">
                    {twoWeekSessions.absent}
                  </div>
                  <div className="text-xs text-red-700">Absent</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-lg font-semibold text-gray-600">
                    {twoWeekSessions.nosessions}
                  </div>
                  <div className="text-xs text-gray-700">No Sessions</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="col-span-12">
            <div className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"} rounded-xl shadow-sm p-4 border`}>
              <h3 className={`text-base font-semibold ${darkMode ? "text-gray-200" : "text-gray-900"} mb-4`}>
                Quick Actions
              </h3>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={index}
                      onClick={action.onClick}
                      className="flex flex-col items-center p-2 rounded-lg transition-all duration-200 hover:scale-105"
                    >
                      <div
                        className={`w-8 h-8 ${action.color} rounded-lg flex items-center justify-center mb-2`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={`text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                        {action.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isClubsModalOpen}
        onClose={() => setIsClubsModalOpen(false)}
        title="Club Details"
        type="info"
      >
        {clubsModalContent}
      </Modal>
    </div>
  );
}

export default ProfilePage;