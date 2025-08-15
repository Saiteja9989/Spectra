import React, { useState, useRef } from "react";
import { Avatar } from "antd";
import { UserOutlined, PhoneOutlined, IdcardOutlined } from "@ant-design/icons";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../baseurl";
import { useDarkMode } from "./DarkModeContext";
import Modal from "./Modal";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { Typography } from "antd";
import HomePageResult from '../Loaders/HomePageResult';

const { Text } = Typography;

const HCaptchaWrapper = ({ onVerify }) => {
  // const isDev = process.env.NODE_ENV === 'development';
  
  return (
    <HCaptcha
      sitekey={"898273e0-27c2-47fa-bf84-7bb23b6432d4"}
      onVerify={onVerify}
    />
  );
};

const UserInputPage = () => {
  const { darkMode } = useDarkMode();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchType, setSearchType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalType, setModalType] = useState("info");
  const [modalContent, setModalContent] = useState(null);
  const [modalAction, setModalAction] = useState(null);
  const [onRejectAction, setOnRejectAction] = useState(null);
  const captchaRef = useRef(null);
  const navigate = useNavigate();

  const openModal = (title, type, content, onConfirm, onReject) => {
    setModalTitle(title);
    setModalType(type);
    setModalContent(content);
    setModalAction(() => onConfirm);
    setOnRejectAction(() => onReject);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalAction(null);
  };

  const handleInputChange = async (e) => {
    const inputValue = e.target.value.toUpperCase();
    setSearchQuery(inputValue);

    if (!inputValue) {
      setSearchResults([]);
      return;
    }

    if (source) {
      source.cancel("Operation canceled due to new input.");
    }

    const cancelToken = axios.CancelToken;
    const newSource = cancelToken.source();
    setSource(newSource);

    determineSearchType(inputValue, newSource);
  };

  const determineSearchType = async (inputValue, cancelTokenSource) => {
    if (/^\d{10}$/.test(inputValue)) {
      setSearchType("phone");
    } else if (/^\d{1,9}$/.test(inputValue)) {
      setSearchType("partialPhone");
    } else if (/^2[a-zA-Z0-9]+$/.test(inputValue)) {
      setSearchType("hallticketno");
    } else {
      setSearchType("name");
    }
    await fetchResults(inputValue, cancelTokenSource);
  };

  const fetchResults = async (inputValue, cancelTokenSource) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${baseUrl}/api/search`,
        { searchInput: inputValue },
        { 
          cancelToken: cancelTokenSource.token,
          timeout: 10000 
        }
      );
      setSearchResults(response.data);
    } catch (error) {
      if (!axios.isCancel(error)) {
        console.error("Error fetching search results:", error);
        openModal(
          "Error", 
          "error", 
          <p>Failed to fetch search results. Please try again.</p>,
          null,
          () => setSearchQuery("")
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResultClick = (result) => {
    console.log("Selected student:", result); // Debug log
    openModal(
      "Verify Captcha",
      "info",
      <div className="flex flex-col items-center space-y-4">
        <p className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}>
          Please verify you're human
        </p>
        <HCaptchaWrapper 
          onVerify={(token) => {
            closeModal();
            handleCaptchaSuccess(result, token);
          }} 
        />
      </div>,
      null,
      () => setSearchQuery("")
    );
  };

  const handleCaptchaSuccess = async (result, captchaToken) => {
    try {
      const response = await axios.post(
        `${baseUrl}/api/def-token`,
        {
          username: result.phone,
          password: "Kmit123$",
          captcha: captchaToken,
          application: "netra"
        },
        { timeout: 30000 } 
      );

      if (response.data.success === 1 && response.data.token) {
        Cookies.set("token", response.data.token, { 
          expires: 7, 
          sameSite: "strict",
        });
        await fetchUserInfo(response.data.token);
      } else {
        showPasswordPrompt(result, captchaToken);
      }
    } catch (error) {
      console.error("Login error:", error);
      
      let errorMessage = "Login failed. Please try again.";
      if (error.code === "ECONNABORTED") {
        errorMessage = "Request timeout. Please check your connection.";
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      openModal(
        "Error", 
        "error", 
        <p>{errorMessage}</p>,
        null,
        () => setSearchQuery("")
      );
    }
  };

  const showPasswordPrompt = (result, captchaToken) => {
    openModal(
      "Enter Password",
      "info",
      <div className="space-y-4">
        <div>
          <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
            Password
          </label>
          <input
            type="password"
            id="password"
            className={`w-full p-2 rounded border ${
              darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"
            }`}
            autoComplete="current-password"
          />
        </div>
      </div>,
      async () => {
        const password = document.getElementById("password").value;
        if (!password) {
          openModal("Error", "error", <p>Password is required.</p>);
          return;
        }
        try {
          const response = await axios.post(
            `${baseUrl}/api/get-token`,
            {
              username: result.phone,
              password,
              captcha: captchaToken,
              application: "netra"
            },
            { timeout: 10000 }
          );
          
          if (response.data.token) {
            Cookies.set("token", response.data.token, { 
              expires: 7, 
              sameSite: "strict",
              secure: process.env.NODE_ENV === 'production'
            });
            await fetchUserInfo(response.data.token);
          } else {
            openModal(
              "Error", 
              "error", 
              <p>Invalid password. Please try again.</p>,
              () => showPasswordPrompt(result, captchaToken)
            );
          }
        } catch (error) {
          console.error("Login error:", error);
          let errorMessage = "Login failed. Please try again.";
          if (error.response?.data?.error) {
            errorMessage = error.response.data.error;
          }
          openModal(
            "Error", 
            "error", 
            <p>{errorMessage}</p>,
            () => showPasswordPrompt(result, captchaToken)
          );
        }
      }
    );
  };

  const fetchUserInfo = async (tokenFromLogin) => {
  try {
    // Get token from login or from cookies
    const token = tokenFromLogin || Cookies.get("token");

    // Call backend /userinfo which will decode JWT and fetch KMIT API
    const response = await axios.post(
      `${baseUrl}/api/userinfo`,
      {}, // No body needed
      { 
        headers: { 
          Authorization: `Bearer ${token}`
        },
        withCredentials: true, // send cookies if any
        timeout: 10000
      }
    );

    if (response.data) {
      // console.log(response.data)
      // Save the roll number from API response to cookie
      Cookies.set("id", response.data.payload.student.id, { 
        expires: 7, 
        sameSite: "strict",
      });

      // Navigate to user dashboard
      navigate("/user");
    }
  } catch (error) {
    console.error("Error fetching user info:", error);

    let errorMessage = "Failed to fetch user information.";
    if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    }

    openModal(
      "Error", 
      "error", 
      <p>{errorMessage}</p>,
      null,
      () => {
        Cookies.remove("token");
        setSearchQuery("");
      }
    );
  }
};

  const getAvatar = (result) => {
    let icon;
    switch (searchType) {
      case "name": 
        icon = <UserOutlined />; 
        break;
      case "phone":
      case "partialPhone": 
        icon = <PhoneOutlined />; 
        break;
      case "hallticketno": 
        icon = <IdcardOutlined />; 
        break;
      default: 
        icon = <UserOutlined />;
    }
    return (
      <Avatar 
        style={{ backgroundColor: "#1890ff", verticalAlign: "middle" }} 
        size="small" 
        icon={icon} 
      />
    );
  };

  const getResultText = (result) => {
    switch (searchType) {
      case "name":
        return `${result.firstname} ${result.lastname || ''}`.trim();
      case "hallticketno":
        return `${result.hallticketno}`;
      case "phone":
      case "partialPhone":
        return `${result.phone}`;
      default:
        return "";
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gradient-to-b from-blue-50 to-white"}`}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Announcement Banner */}
        <div className={`mb-4 sm:mb-8 rounded-lg ${darkMode ? "bg-gray-800" : "bg-blue-500"} p-3 sm:p-4 ${darkMode ? "text-gray-200" : "text-white"} shadow-lg`}>
          <p className="text-center text-xs sm:text-sm font-medium">
            First-year students: Register on Spectra to access your academic profile
          </p>
        </div>

        {/* Hero Section */}
        <div className="mb-6 sm:mb-12 text-center">
          <h1 className={`text-3xl sm:text-5xl font-bold tracking-tight ${darkMode ? "text-gray-200" : "text-gray-900"}`}>
            KMIT SPECTRA
          </h1>
          <p className={`mt-3 text-sm sm:text-lg ${darkMode ? "text-gray-400" : "text-gray-600"} font-medium`}>
            Access your attendance, results, and academic profile in one place
          </p>
        </div>

        {/* Search Input and Results */}
        <div className={`mt-6 sm:mt-10 ${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-md p-4 sm:p-6`}>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4 sm:space-y-6">
            <div>
              <label htmlFor="search" className={`block text-sm sm:text-base font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-3`}>
                Search Profile
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="text"
                  name="search"
                  id="search"
                  className={`flex-1 min-w-0 block w-full px-3 py-2 sm:px-2 sm:py-1 rounded-md border ${
                    darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"
                  } focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base placeholder-gray-400 transition-all duration-200`}
                  placeholder="Enter Name/ Phone / Roll No"
                  value={searchQuery}
                  onChange={handleInputChange}
                  autoComplete="off"
                />
              </div>
            </div>
          </form>

          {/* Register Button */}
          <div className="mt-4 sm:mt-6 text-center">
            <p className={`mb-2 sm:mb-3 text-sm sm:text-base ${darkMode ? "text-gray-400" : "text-gray-600"} font-medium`}>
              Not found in the search results?
            </p>
            <button
              onClick={() => navigate("/register")}
              className={`inline-flex items-center px-4 py-2 sm:px-3 sm:py-1.5 border border-transparent text-sm sm:text-base font-semibold rounded-md shadow-sm ${
                darkMode ? "bg-green-600 hover:bg-green-700" : "bg-green-600 hover:bg-green-700"
              } text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200`}
            >
              Register on Spectra
            </button>
          </div>
        </div>

        {/* Search Results */}
        {!loading && searchQuery && (
          <div className="mt-4 sm:mt-6 max-w-md mx-auto">
            <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-md p-3 sm:p-4`}>
              <div className="space-y-2 sm:space-y-3">
                {searchResults.map((result, index) => (
                  <div
                    key={index}
                    onClick={() => handleResultClick(result)}
                    className={`group p-2 sm:p-3 rounded-lg ${
                      darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                    } cursor-pointer transition-all duration-200`}
                  >
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="flex-shrink-0">{getAvatar(result)}</div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm sm:text-base font-semibold ${darkMode ? "text-gray-200" : "text-gray-900"} truncate`}>
                          {getResultText(result)}
                        </p>
                        {result.currentyear && (
                          <p className={`text-xs sm:text-sm ${darkMode ? "text-gray-400" : "text-gray-500"} mt-0.5`}>
                            <span className="font-medium">Current Year:</span> {result.currentyear}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Loader */}
        {loading && (
          <div className="mt-4 sm:mt-6 max-w-md mx-auto">
            <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-md p-3 sm:p-4`}>
              <div className="flex justify-center items-center">
                <HomePageResult/>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Component */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          onRejectAction?.();
        }}
        title={modalTitle}
        type={modalType}
        onConfirm={modalAction}
        onReject={onRejectAction}
      >
        {modalContent}
      </Modal>
    </div>
  );
};

export default UserInputPage;