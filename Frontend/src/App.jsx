import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SearchPage from './components/Homepage'; // Import SearchPage
import OptionsPage from './components/options';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SearchPage/>} /> {/* Updated to SearchPage */}
        <Route path="/options" element={<OptionsPage/>} />
      </Routes>
    </Router>
  );
};

export default App;
