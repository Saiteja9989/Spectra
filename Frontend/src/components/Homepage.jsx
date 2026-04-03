import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../baseurl";
import { useDarkMode } from "./DarkModeContext";
import Modal from "./Modal";
import HomePageResult from '../Loaders/HomePageResult';
import { Search, User, Phone, CreditCard, Zap, ChevronRight, UserPlus } from "lucide-react";

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

    if (source) source.cancel("Operation canceled due to new input.");

    const cancelToken = axios.CancelToken;
    const newSource = cancelToken.source();
    setSource(newSource);
    determineSearchType(inputValue, newSource);
  };

  const determineSearchType = async (inputValue, cancelTokenSource) => {
    if (/^\d{10}$/.test(inputValue)) setSearchType("phone");
    else if (/^\d{1,9}$/.test(inputValue)) setSearchType("partialPhone");
    else if (/^2[a-zA-Z0-9]+$/.test(inputValue)) setSearchType("hallticketno");
    else setSearchType("name");
    await fetchResults(inputValue, cancelTokenSource);
  };

  const fetchResults = async (inputValue, cancelTokenSource) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${baseUrl}/api/search`,
        { searchInput: inputValue },
        { cancelToken: cancelTokenSource.token, timeout: 10000 }
      );
      setSearchResults(response.data);
    } catch (error) {
      if (!axios.isCancel(error)) {
        openModal("Search Error", "error", <p>Failed to fetch search results. Please try again.</p>, null, () => setSearchQuery(""));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResultClick = (result) => handleBrowserLogin(result);

  const handleBrowserLogin = async (result) => {
    openModal(
      "Logging in...",
      "info",
      <div className="flex flex-col items-center gap-3 py-2">
        <div className="relative">
          <div className="w-10 h-10 rounded-full border-2 border-white/10" />
          <div className="absolute inset-0 w-10 h-10 rounded-full border-2 border-transparent border-t-indigo-500 border-r-violet-500 animate-spin" />
        </div>
        <p className={`text-sm text-center ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
          Verifying with college server. This may take ~10 seconds.
        </p>
      </div>,
      null, null
    );

    try {
      const response = await axios.post(`${baseUrl}/api/browser-login`, { username: result.phone }, { timeout: 40000 });
      if (response.data.success === 1 && response.data.token) {
        closeModal();
        Cookies.set("token", response.data.token, { expires: 7, sameSite: "strict" });
        await fetchUserInfo(response.data.token);
      } else {
        closeModal();
        showPasswordPrompt(result);
      }
    } catch (error) {
      closeModal();
      let errorMessage = "Login failed. Please try again.";
      if (error.code === "ECONNABORTED") errorMessage = "Request timeout. Please check your connection.";
      else if (error.response?.data?.error) errorMessage = error.response.data.error;
      openModal("Login Failed", "error", <p>{errorMessage}</p>, null, () => setSearchQuery(""));
    }
  };

  const showPasswordPrompt = (result) => {
    openModal(
      "Enter Password",
      "info",
      <div className="space-y-3">
        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          Default password didn't work. Enter your Netra password.
        </p>
        <div>
          <label className={`block text-xs font-medium mb-1.5 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
            Netra Password
          </label>
          <input
            type="password"
            id="password"
            className={`w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-all ${
              darkMode
                ? "bg-gray-800 border-white/10 text-white focus:border-indigo-500"
                : "bg-gray-50 border-gray-200 text-gray-900 focus:border-indigo-500"
            }`}
            placeholder="Enter your password"
            autoComplete="current-password"
          />
        </div>
      </div>,
      async () => {
        const password = document.getElementById("password").value;
        if (!password) { openModal("Error", "error", <p>Password is required.</p>); return; }
        try {
          const response = await axios.post(`${baseUrl}/api/browser-login`, { username: result.phone, password }, { timeout: 40000 });
          if (response.data.token) {
            Cookies.set("token", response.data.token, { expires: 7, sameSite: "strict" });
            await fetchUserInfo(response.data.token);
          } else {
            openModal("Invalid Password", "error", <p>Invalid password. Please try again.</p>, () => showPasswordPrompt(result));
          }
        } catch (error) {
          let errorMessage = "Login failed. Please try again.";
          if (error.response?.data?.error) errorMessage = error.response.data.error;
          openModal("Login Failed", "error", <p>{errorMessage}</p>, () => showPasswordPrompt(result));
        }
      }
    );
  };

  const fetchUserInfo = async (tokenFromLogin) => {
    try {
      const token = tokenFromLogin || Cookies.get("token");
      const response = await axios.post(
        `${baseUrl}/api/userinfo`, {},
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true, timeout: 10000 }
      );
      if (response.data) {
        Cookies.set("id", response.data.payload.student.id, { expires: 7, sameSite: "strict" });
        navigate("/user");
      }
    } catch (error) {
      let errorMessage = "Failed to fetch user information.";
      if (error.response?.data?.error) errorMessage = error.response.data.error;
      openModal("Error", "error", <p>{errorMessage}</p>, null, () => { Cookies.remove("token"); setSearchQuery(""); });
    }
  };

  const getIcon = () => {
    switch (searchType) {
      case "name": return User;
      case "phone": case "partialPhone": return Phone;
      case "hallticketno": return CreditCard;
      default: return User;
    }
  };

  const getResultText = (result) => {
    switch (searchType) {
      case "name": return `${result.firstname} ${result.lastname || ''}`.trim();
      case "hallticketno": return result.hallticketno;
      case "phone": case "partialPhone": return result.phone;
      default: return "";
    }
  };

  const getSubText = (result) => {
    if (searchType === "name") return result.hallticketno || result.phone || "";
    if (searchType === "hallticketno") return `${result.firstname} ${result.lastname || ''}`.trim();
    if (searchType === "phone" || searchType === "partialPhone") return `${result.firstname} ${result.lastname || ''}`.trim();
    return "";
  };

  const ResultIcon = getIcon();

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-950" : "bg-gray-50"} relative overflow-hidden`}>
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-indigo-500/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-violet-500/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-2xl px-4 pt-16 pb-10">
        {/* Hero */}
        <div className="text-center mb-10 pt-8">
          <div className="inline-flex items-center gap-2 mb-5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className={`text-2xl font-bold tracking-tight ${darkMode ? "text-white" : "text-gray-900"}`}>SPECTRA</span>
          </div>
          <h1 className={`text-3xl sm:text-4xl font-bold tracking-tight mb-3 ${darkMode ? "text-white" : "text-gray-900"}`}>
            Your Academic{" "}
            <span className="gradient-text">Portal</span>
          </h1>
          <p className={`text-sm sm:text-base ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            Access attendance, results &amp; academic profile in one place
          </p>
        </div>

        {/* Info banner */}
        <div className={`mb-6 rounded-2xl border px-4 py-3 flex items-center gap-3 ${
          darkMode ? "bg-indigo-500/10 border-indigo-500/20" : "bg-indigo-50 border-indigo-100"
        }`}>
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
          <p className={`text-xs font-medium ${darkMode ? "text-indigo-300" : "text-indigo-700"}`}>
            First-year students: Register on Spectra to access your academic profile
          </p>
        </div>

        {/* Search card */}
        <div className={`rounded-2xl border p-5 ${
          darkMode ? "bg-gray-900 border-white/5" : "bg-white border-gray-100"
        } shadow-sm`}>
          <label className={`block text-xs font-semibold tracking-wide uppercase mb-3 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            Search Profile
          </label>
          <div className="relative">
            <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
            <input
              type="text"
              className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition-all duration-200 ${
                darkMode
                  ? "bg-gray-800 border-white/8 text-white placeholder-gray-500 focus:border-indigo-500/50 focus:bg-gray-800"
                  : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-indigo-400 focus:bg-white"
              }`}
              placeholder="Name, Phone Number, or Roll No"
              value={searchQuery}
              onChange={handleInputChange}
              autoComplete="off"
            />
          </div>

          {/* Register link */}
          <div className="mt-4 pt-4 border-t flex items-center justify-between" style={{ borderColor: darkMode ? 'rgba(255,255,255,0.05)' : '#f3f4f6' }}>
            <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
              Not found in results?
            </p>
            <button
              onClick={() => navigate("/register")}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-500 hover:text-emerald-400 transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Register on Spectra
            </button>
          </div>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className={`mt-3 rounded-2xl border p-4 ${darkMode ? "bg-gray-900 border-white/5" : "bg-white border-gray-100"}`}>
            <HomePageResult />
          </div>
        )}

        {/* Results */}
        {!loading && searchQuery && searchResults.length > 0 && (
          <div className={`mt-3 rounded-2xl border overflow-hidden ${darkMode ? "bg-gray-900 border-white/5" : "bg-white border-gray-100"}`}>
            {searchResults.map((result, index) => (
              <button
                key={index}
                onClick={() => handleResultClick(result)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-150 ${
                  darkMode ? "hover:bg-white/5 border-white/5" : "hover:bg-gray-50 border-gray-50"
                } ${index !== 0 ? "border-t" : ""}`}
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 flex items-center justify-center flex-shrink-0">
                  <ResultIcon className={`w-4 h-4 ${darkMode ? "text-indigo-400" : "text-indigo-600"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold truncate ${darkMode ? "text-white" : "text-gray-900"}`}>
                    {getResultText(result)}
                  </p>
                  {getSubText(result) && (
                    <p className={`text-xs truncate mt-0.5 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                      {getSubText(result)}
                      {result.currentyear && ` • Year ${result.currentyear}`}
                    </p>
                  )}
                </div>
                <ChevronRight className={`w-4 h-4 flex-shrink-0 ${darkMode ? "text-gray-600" : "text-gray-300"}`} />
              </button>
            ))}
          </div>
        )}

        {/* No results */}
        {!loading && searchQuery && searchResults.length === 0 && (
          <div className={`mt-3 rounded-2xl border p-8 text-center ${darkMode ? "bg-gray-900 border-white/5" : "bg-white border-gray-100"}`}>
            <div className={`w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
              <Search className={`w-5 h-5 ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
            </div>
            <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>No results found</p>
            <p className={`text-xs mt-1 ${darkMode ? "text-gray-600" : "text-gray-400"}`}>Try a different search term</p>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); onRejectAction?.(); }}
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
