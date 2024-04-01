import React from 'react';
import  { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SearchPage from './components/Homepage'; // Import SearchPage
import OptionsPage from './components/options';
import Check from './components/check'

const App = () => {
  const [netraID, setNetraID] = useState(null);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SearchPage setNetraID={ setNetraID} />} /> 
        <Route path="/check" element={<Check netraID={ netraID} />} />
        <Route path="/options" element={<OptionsPage />} />
      </Routes>
      </Router>
      
  );
};

export default App;
