import React, { createContext, useState, useEffect, useContext } from "react";

// Create the context
const DarkModeContext = createContext();

// Create a provider component
export const DarkModeProvider = ({ children }) => {
  // Initialize darkMode state from localStorage or default to false
  const [darkMode, setDarkMode] = useState(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    return savedDarkMode ? JSON.parse(savedDarkMode) : false;
  });

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode((prevMode) => {
      const newMode = !prevMode;
      // Save the new mode to localStorage
      localStorage.setItem("darkMode", JSON.stringify(newMode));
      return newMode;
    });
  };

  // Add or remove the 'dark' class from the HTML element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

// Custom hook to use the dark mode context
export const useDarkMode = () => useContext(DarkModeContext);