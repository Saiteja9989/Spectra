// src/components/Netraqr.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { QrCode, Download, Share2 } from "lucide-react";
import { baseUrl } from "../baseurl"; // Ensure this is the correct base URL for your backend
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom"; // For navigation
import Navbar from "./Navbar"; // Import the Navbar component
import { useDarkMode } from "./DarkModeContext"; // Import the dark mode hook

function Netraqr() {
  const { darkMode } = useDarkMode(); // Access dark mode state
  const [hallticketno, setHallticketno] = useState("");
  const [qrImageUrl, setQrImageUrl] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const token = Cookies.get("token"); // Read the token from the cookies
    const processNetraid = async () => {
      try {
        if (!token) {
          setError("Token is missing");
          setIsLoading(false);
          return;
        }

        const response = await axios.post(
          `${baseUrl}/api/netraqr`,
          {
            method: "32", // Adjust method as needed
          },
          {
            headers: {
              Authorization: `Bearer ${token}`, // Set token as Authorization header
            },
          }
        );

        if (response.data && response.data.hallticketno) {
          const fetchedHallticketno = response.data.hallticketno;
          setHallticketno(fetchedHallticketno);
          setError("");
          await fetchQRImage(fetchedHallticketno); // Fetch QR image
        } else {
          setError("Unable to retrieve hall ticket number");
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error processing netraid:", error.message);
        setError("Error processing netraid");
        setIsLoading(false);
      }
    };

    processNetraid();
  }, []);

  const fetchQRImage = async (hallticketno) => {
    try {
      const response = await axios.post(`${baseUrl}/api/fetchqr`, {
        hallticketno,
      });

      if (response.data && response.data.imageUrl) {
        setQrImageUrl(response.data.imageUrl);
      } else {
        setError("Failed to fetch QR image");
      }
    } catch (error) {
      console.error("Error fetching QR image:", error.message);
      setError("Error fetching QR image");
    } finally {
      setIsLoading(false); // Stop loading once QR image is fetched or an error occurs
    }
  };

  // Download QR Code
  const handleDownload = () => {
    if (qrImageUrl) {
      const link = document.createElement("a");
      link.href = qrImageUrl;
      link.download = `QR_Code_${hallticketno}.png`; // Set the file name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Share QR Code
  const handleShare = async () => {
    if (qrImageUrl) {
      try {
        await navigator.share({
          title: "Netra QR Code",
          text: `Hall Ticket Number: ${hallticketno}`,
          url: qrImageUrl,
        });
      } catch (error) {
        console.error("Error sharing QR code:", error);
        alert("Sharing is not supported in your browser.");
      }
    }
  };

  return (
    <>
      {/* Add the Navbar */}
      <Navbar />

      {/* Main Content */}
      {isLoading ? (
        // Loading Spinner
        <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gradient-to-br from-blue-50 to-indigo-50"} flex items-center justify-center`}>
          <div className={`animate-spin rounded-full h-12 w-12 border-4 ${
            darkMode ? "border-gray-700 border-t-blue-600" : "border-blue-200 border-t-blue-600"
          }`}></div>
        </div>
      ) : (
        <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gradient-to-br from-blue-50 to-indigo-50"} flex items-center justify-center p-4 pt-20`}>
          <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-2xl shadow-xl p-8 w-full max-w-md`}>
            {/* Header */}
            <div className="flex items-center justify-center space-x-3 mb-8">
              <div className={`${darkMode ? "bg-gray-700" : "bg-blue-100"} p-2 rounded-lg`}>
                <QrCode className={`w-6 h-6 ${darkMode ? "text-blue-400" : "text-blue-600"}`} />
              </div>
              <h1 className={`text-2xl font-bold ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                Netra Details
              </h1>
            </div>

            {/* Error Message */}
            {error && (
              <div className={`${darkMode ? "bg-red-900/20" : "bg-red-50"} border-l-4 ${
                darkMode ? "border-red-600" : "border-red-500"
              } p-4 rounded-md mb-6`}>
                <p className={`${darkMode ? "text-red-400" : "text-red-700"}`}>{error}</p>
              </div>
            )}

            {/* Hall Ticket Details */}
            {hallticketno && (
              <div className={`${darkMode ? "bg-gray-700" : "bg-gray-50"} rounded-lg p-4 mb-6`}>
                <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-500"} mb-1`}>
                  Hall Ticket Number
                </p>
                <p className={`text-lg font-semibold ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                  {hallticketno}
                </p>
              </div>
            )}

            {/* QR Code Display */}
            {qrImageUrl && (
              <div className="flex flex-col items-center">
                <div className={`${darkMode ? "bg-gray-700" : "bg-white"} p-6 rounded-xl border-2 ${
                  darkMode ? "border-gray-600" : "border-gray-100"
                } shadow-sm hover:shadow-md transition-shadow duration-300`}>
                  <img
                    src={qrImageUrl}
                    alt="QR Code"
                    className="w-56 h-56 object-contain"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mt-6">
                  <button
                    onClick={handleDownload}
                    className={`flex items-center gap-2 px-4 py-2 ${
                      darkMode ? "bg-blue-700 hover:bg-blue-600" : "bg-blue-600 hover:bg-blue-700"
                    } text-white rounded-lg transition-colors duration-200`}
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                  <button
                    onClick={handleShare}
                    className={`flex items-center gap-2 px-4 py-2 ${
                      darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"
                    } ${darkMode ? "text-gray-200" : "text-gray-700"} rounded-lg transition-colors duration-200`}
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            )}

            {/* Footer Note */}
            <p className={`text-center ${darkMode ? "text-gray-400" : "text-gray-500"} text-sm mt-8`}>
              Scan the QR code to verify your details
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default Netraqr;