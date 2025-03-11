import React, { useState } from "react";
import { Input, Button, Avatar, Typography } from "antd";
import { UserOutlined, PhoneOutlined, IdcardOutlined } from "@ant-design/icons";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../baseurl";
import { useDarkMode } from "./DarkModeContext"; // Import the dark mode hook
import Modal from "./Modal"; // Import the Modal component
import { X } from "lucide-react"; // Import the X icon for the modal
import HomePageResult from '../Loaders/HomePageResult';

const { Text } = Typography;

const UserInputPage = () => {
  const { darkMode } = useDarkMode(); // Access dark mode state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchType, setSearchType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState(null);
  const navigate = useNavigate();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalType, setModalType] = useState("info"); // 'info', 'success', 'error'
  const [modalContent, setModalContent] = useState(null);
  const [modalAction, setModalAction] = useState(null); // For confirm actions
  const [onRejectAction, setOnRejectAction] = React.useState(null);

  // Open modal function
  const openModal = (title, type, content, onConfirm, onReject) => {
    console.log("Opening modal with title:", title); // Debugging
    console.log("onReject callback:", onReject); // Debugging
    setModalTitle(title);
    setModalType(type);
    setModalContent(content);
    setModalAction(() => onConfirm);
    setOnRejectAction(() => onReject); // Set the onReject callback
    setIsModalOpen(true);
  };
  // Close modal function
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
        { cancelToken: cancelTokenSource.token }
      );
      setSearchResults(response.data);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Request canceled:", error.message);
      } else {
        console.error("Error fetching search results:", error);
        openModal(
          "Error",
          "error",
          <p>Failed to fetch search results. Please try again.</p>
        );
      }
    } finally {
      setLoading(false);
    }
  };
  const handleResultClick = async (result) => {
    const resultText = getResultText(result).trim();
    setSearchQuery(resultText);
  
    try {
      const response = await axios.post(`${baseUrl}/api/def-token`, {
        id: result._id,
      });
  
      if (response.data.success !== 1) {
        // If the token is not generated, show the password prompt
        showPasswordPrompt(result);
      } else {
        // Set the token in cookies
        Cookies.set("token", response.data.token, {
          expires: 7,
          sameSite: "strict",
        });
        console.log("Token set in cookies:", Cookies.get("token")); // Debugging
  
        // Fetch user info and wait for it to complete
        await fetchUserInfo(response.data.token, result._id);
  
        console.log("User info fetched, navigating to /user"); // Debugging
      }
    } catch (error) {
      console.error("Error logging in:", error);
      openModal(
        "Login Failed",
        "error",
        <p>Failed to log in. Please try again.</p>
      );
    }
  };
  const showPasswordPrompt = (result) => {
    openModal(
      "Enter KMIT Netra Password",
      "info",
      <div>
        <input
          type="password"
          id="password"
          className={`w-full p-2 rounded border ${
            darkMode
              ? "bg-gray-700 border-gray-600 text-white"
              : "bg-white border-gray-300"
          }`}
          placeholder="Password"
          autoComplete="off"
        />
      </div>,
      async () => {
        const password = document.getElementById("password").value;
        if (!password) {
          openModal("Error", "error", <p>Password is required.</p>);
          return;
        }
        try {
          const response = await axios.post(`${baseUrl}/api/get-token`, {
            id: result._id,
            password: password,
          });
          if (response.data.token) {
            Cookies.set("token", response.data.token, {
              expires: 7,
              sameSite: "strict",
            });
            fetchUserInfo(response.data.token, result._id);
          } else {
            openModal(
              "Error",
              "error",
              <p>Invalid token. Please try again.</p>
            );
          }
        } catch (error) {
          console.error("Error logging in:", error);
          openModal("Error", "error", <p>Login failed. Please try again.</p>);
        }
      }
    );
  };
  const fetchUserInfo = async (token, id) => {
    try {
      const response = await axios.post(
        `${baseUrl}/api/userinfo`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.data) {
        const { rollno } = response.data;
        // Set rollno in cookies only (localStorage removed)
        Cookies.set("rollno", rollno, { expires: 7, sameSite: "strict" });
        console.log("Rollno set in cookies:", Cookies.get("rollno")); // Debugging
  
        // Navigate to the user dashboard after successful fetch
        navigate("/user");
        console.log("Navigated to /user"); // Debugging
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
      openModal("Error", "error", <p>Failed to fetch user information.</p>);
      throw error; // Re-throw the error to handle it in the calling function
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
        return `${result.firstname}`;
      case "hallticketno":
        return `${result.hallticketno}`;
      case "phone":
        return `${result.phone}`;
      case "partialPhone":
        return `${result.phone}`;
      default:
        return "";
    }
  };

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900" : "bg-gradient-to-b from-blue-50 to-white"
      }`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Announcement Banner */}
        <div
          className={`mb-4 sm:mb-8 rounded-lg ${
            darkMode ? "bg-gray-800" : "bg-blue-500"
          } p-3 sm:p-4 ${darkMode ? "text-gray-200" : "text-white"} shadow-lg`}
        >
          <p className="text-center text-xs sm:text-sm font-medium">
            First-year students: Register on Spectra to access your academic
            profile
          </p>
        </div>

        {/* Hero Section */}
        <div className="mb-6 sm:mb-12 text-center">
          <h1
            className={`text-3xl sm:text-5xl font-bold tracking-tight ${
              darkMode ? "text-gray-200" : "text-gray-900"
            }`}
          >
            KMIT SPECTRA
          </h1>
          <p
            className={`mt-3 text-sm sm:text-lg ${
              darkMode ? "text-gray-400" : "text-gray-600"
            } font-medium`}
          >
            Access your attendance, results, and academic profile in one place
          </p>
        </div>

        {/* Search Input and Results */}
        <div
          className={`mt-6 sm:mt-10 ${
            darkMode ? "bg-gray-800" : "bg-white"
          } rounded-lg shadow-md p-4 sm:p-6`}
        >
          <form
            onSubmit={(e) => e.preventDefault()}
            className="space-y-4 sm:space-y-6"
          >
            <div>
              <label
                htmlFor="search"
                className={`block text-sm sm:text-base font-medium ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                } mb-3`}
              >
                Search Profile
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="text"
                  name="search"
                  id="search"
                  className={`flex-1 min-w-0 block w-full px-3 py-2 sm:px-2 sm:py-1 rounded-md border ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300"
                  } focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base placeholder-gray-400 transition-all duration-200`}
                  placeholder="Enter Name/ Phone / Roll No"
                  value={searchQuery}
                  onChange={handleInputChange}
                />
                <button
                  type="submit"
                  className={`ml-2 sm:ml-3 inline-flex items-center px-4 py-2 sm:px-3 sm:py-1.5 border border-transparent text-sm sm:text-base font-semibold rounded-md shadow-sm ${
                    darkMode
                      ? "bg-indigo-600 hover:bg-indigo-700"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  } text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200`}
                >
                  Search
                </button>
              </div>
            </div>
          </form>

          {/* Register Button */}
          <div className="mt-4 sm:mt-6 text-center">
            <p
              className={`mb-2 sm:mb-3 text-sm sm:text-base ${
                darkMode ? "text-gray-400" : "text-gray-600"
              } font-medium`}
            >
              Not found in the search results?
            </p>
            <button
              onClick={() => navigate("/register")}
              className={`inline-flex items-center px-4 py-2 sm:px-3 sm:py-1.5 border border-transparent text-sm sm:text-base font-semibold rounded-md shadow-sm ${
                darkMode
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-green-600 hover:bg-green-700"
              } text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200`}
            >
              Register on Spectra
            </button>
          </div>
        </div>

        {/* Search Results */}
        {!loading && searchQuery && (
          <div className="mt-4 sm:mt-6 max-w-md mx-auto">
            <div
              className={`${
                darkMode ? "bg-gray-800" : "bg-white"
              } rounded-lg shadow-md p-3 sm:p-4`}
            >
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
                        <p
                          className={`text-sm sm:text-base font-semibold ${
                            darkMode ? "text-gray-200" : "text-gray-900"
                          } truncate`}
                        >
                          {getResultText(result)}
                        </p>
                        <p
                          className={`text-xs sm:text-sm ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          } mt-0.5`}
                        >
                          <span className="font-medium">Current Year:</span>{" "}
                          {result.currentyear}
                        </p>
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
            <div
              className={`${
                darkMode ? "bg-gray-800" : "bg-white"
              } rounded-lg shadow-md p-3 sm:p-4`}
            >
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
          onRejectAction?.(); // Trigger onReject when the modal is closed
        }}
        title={modalTitle}
        type={modalType}
        onConfirm={modalAction}
        onReject={onRejectAction} // Pass onReject to the Modal
      >
        {modalContent}
      </Modal>
    </div>
  );
};

export default UserInputPage;