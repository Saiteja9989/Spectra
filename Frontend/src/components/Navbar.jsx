import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Moon, Search, Sun, Zap } from 'lucide-react';
import { useDarkMode } from './DarkModeContext';
import Cookies from 'js-cookie';

export default function Navbar({ setToken }) {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useDarkMode();

  const handleSearchClick = () => {
    Cookies.remove('token');
    if (setToken) setToken(null);
    navigate('/search');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 glass border-b transition-colors duration-300 ${
      darkMode ? 'bg-gray-950/80 border-white/5' : 'bg-white/80 border-gray-200/60'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className={`p-2 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 ${
                darkMode ? 'hover:bg-white/8 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
              }`}
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <Link to="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className={`font-bold text-sm tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>SPECTRA</span>
            </Link>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={handleSearchClick} className={`p-2 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 ${darkMode ? 'hover:bg-white/8 text-gray-400 hover:text-indigo-400' : 'hover:bg-gray-100 text-gray-500 hover:text-indigo-600'}`}>
              <Search className="h-4 w-4" />
            </button>
            <button onClick={toggleDarkMode} className={`p-2 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 ${darkMode ? 'hover:bg-white/8 text-gray-400 hover:text-yellow-400' : 'hover:bg-gray-100 text-gray-500 hover:text-indigo-600'}`}>
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
