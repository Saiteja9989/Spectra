// src/components/FeedbackForm.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "js-cookie"; // Import Cookies library
import Loader from "./Loader";
import { baseUrl } from "../baseurl";
import { Star } from "lucide-react"; // Import Star icon
import { useNavigate } from "react-router-dom"; // Import useNavigate for routing
import Navbar from "./Navbar"; // Import the Navbar component
import { useDarkMode } from "./DarkModeContext"; // Import the dark mode hook

const FeedbackForm = () => {
  const { darkMode } = useDarkMode(); // Access dark mode state
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState("");
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(false);
  const [rollno, setRollno] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    // Retrieve rollno from cookies
    const storedRollno = Cookies.get("rollno");
    if (storedRollno) {
      setRollno(storedRollno);
    }
  }, []);

  const handleRatingChange = (value) => {
    setRating(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${baseUrl}/api/submit/feedback`, {
        rating,
        name,
        comments,
        rollno,
      });

      console.log("Feedback submitted successfully:", response.data);

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Feedback submitted successfully",
        confirmButtonText: "OK",
      });

      // Reset form
      setRating(0);
      setName("");
      setComments("");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to submit feedback. Please try again.",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Add the Navbar */}
      <Navbar />

      {/* Feedback Form */}
      <div className={`min-h-screen ${
        darkMode ? "bg-gray-900" : "bg-gradient-to-br from-blue-50 via-indigo-50 to-white"
      } py-12 px-4 sm:px-6 lg:px-8 pt-20`}>
        <div className="max-w-md mx-auto">
          <div className={`${
            darkMode ? "bg-gray-800/80" : "bg-white/80"
          } backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden ${
            darkMode ? "border-gray-700" : "border-indigo-50"
          } border`}>
            <div className="px-6 py-8 sm:p-10">
              <div className="text-center mb-8">
                <h2 className={`text-3xl font-bold bg-gradient-to-r ${
                  darkMode ? "from-blue-400 to-indigo-400" : "from-blue-600 to-indigo-600"
                } bg-clip-text text-transparent`}>
                  Your Feedback Matters
                </h2>
                <p className={`mt-2 text-sm ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}>
                  Help us improve your college experience
                </p>
              </div>

              {loading ? (
                <Loader />
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Rating Stars */}
                  <div className="flex flex-col items-center gap-2">
                    <label className={`text-sm font-medium ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}>
                      How would you rate your experience?
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className="transition-all duration-200 hover:scale-110 focus:outline-none"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => handleRatingChange(star)}
                        >
                          <Star
                            className={`w-8 h-8 ${
                              star <= (hoverRating || rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : darkMode
                                ? "text-gray-500"
                                : "text-gray-300"
                            } transition-colors duration-200`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name Input */}
                  <div className="space-y-1">
                    <label
                      htmlFor="name"
                      className={`block text-sm font-medium ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`block w-full rounded-lg ${
                        darkMode ? "bg-gray-700/50 border-gray-600" : "bg-white/50 border-gray-200"
                      } px-4 py-3 ${
                        darkMode ? "text-gray-200" : "text-gray-700"
                      } focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-shadow duration-200`}
                      placeholder="Enter your name"
                      required
                    />
                  </div>

                  {/* Comments Textarea */}
                  <div className="space-y-1">
                    <label
                      htmlFor="comments"
                      className={`block text-sm font-medium ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Comments
                    </label>
                    <textarea
                      id="comments"
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      rows={4}
                      className={`block w-full rounded-lg ${
                        darkMode ? "bg-gray-700/50 border-gray-600" : "bg-white/50 border-gray-200"
                      } px-4 py-3 ${
                        darkMode ? "text-gray-200" : "text-gray-700"
                      } focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-shadow duration-200 resize-none`}
                      placeholder="Share your thoughts with us..."
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading || !rating || !name || !comments}
                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium ${
                      darkMode ? "text-white" : "text-white"
                    } bg-gradient-to-r ${
                      darkMode ? "from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600" 
                      : "from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      darkMode ? "focus:ring-blue-400" : "focus:ring-blue-500"
                    } disabled:opacity-50 disabled:cursor-not-allowed ${
                      darkMode ? "disabled:hover:from-blue-500 disabled:hover:to-indigo-500" 
                      : "disabled:hover:from-blue-600 disabled:hover:to-indigo-600"
                    } transition-all duration-200 shadow-lg hover:shadow-xl`}
                  >
                    {loading ? (
                      <div className={`animate-spin rounded-full h-5 w-5 border-2 ${
                        darkMode ? "border-white border-t-transparent" : "border-white border-t-transparent"
                      }`} />
                    ) : (
                      "Submit Feedback"
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FeedbackForm;