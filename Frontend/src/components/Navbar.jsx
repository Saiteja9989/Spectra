import React from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Importing hooks and components for navigation
import { ArrowLeft, Moon, Search, Sun } from 'lucide-react'; // Importing icons from lucide-react
import { useDarkMode } from './DarkModeContext'; // Importing custom hook for dark mode
import Cookies from 'js-cookie'; // Importing js-cookie to manage cookies

export default function Navbar({ setToken }) { // Accept setToken as a prop
  const navigate = useNavigate(); // Hook for programmatic navigation
  const { darkMode, toggleDarkMode } = useDarkMode(); // Destructuring dark mode state and toggle function

  // Function to handle search icon click
  const handleSearchClick = () => {
    // Clear the token from cookies
    Cookies.remove('token');
    // Update the token state (if setToken is provided as a prop)
    if (setToken) {
      setToken(null);
    }
    // Navigate to the search page
    navigate('/search');
  };

  return (
    // Navbar container with fixed positioning and dynamic styling based on dark mode
    <nav className={`fixed top-0 left-0 right-0 z-50 ${
      darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'
    } border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} transition-colors duration-300`}>
      {/* Centered container with max-width and padding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Flex container for navbar content */}
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            {/* Back button with hover and active effects */}
            <button
              onClick={() => navigate(-1)} // Navigate back in history
              className={`p-2 rounded-full hover:bg-${darkMode ? 'gray-800' : 'gray-100'} 
                transform transition-all duration-200 hover:scale-110 active:scale-95`}
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" /> {/* Back arrow icon */}
            </button>
            
            {/* Home link with hover effects */}
            <Link
              to="/"
              className="flex items-center space-x-2 font-semibold text-lg hover:text-blue-500 
                transition-all duration-200 transform hover:scale-105"
            >
              {/* <span>MyApp</span> App name */}
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-6">
            {/* Search link with hover and active effects */}
            <button
              onClick={handleSearchClick} // Call handleSearchClick when clicked
              className={`p-3 rounded-full hover:bg-${darkMode ? 'gray-800' : 'gray-100'} 
                transform transition-all duration-200 hover:scale-110 active:scale-95
                hover:text-blue-500`}
              aria-label="Search"
            >
              <Search className="h-5 w-5" /> {/* Search icon */}
            </button>
            
            {/* Dark mode toggle button with hover and active effects */}
            <button
              onClick={toggleDarkMode} // Toggle dark mode
              className={`p-3 rounded-full hover:bg-${darkMode ? 'gray-800' : 'gray-100'} 
                transform transition-all duration-200 hover:scale-110 active:scale-95
                hover:text-blue-500`}
              aria-label="Toggle dark mode"
            >
              {/* Display Sun icon in dark mode and Moon icon in light mode */}
              {darkMode ? (
                <Sun className="h-5 w-5 transform transition-transform duration-300 rotate-0 hover:rotate-90" />
              ) : (
                <Moon className="h-5 w-5 transform transition-transform duration-300 rotate-0 hover:-rotate-90" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}