import React from 'react';
import { useDarkMode } from './DarkModeContext';

const Loader = ({ size = 'md', label = '' }) => {
  const { darkMode } = useDarkMode();
  const sz = { sm: 'w-5 h-5', md: 'w-9 h-9', lg: 'w-14 h-14' }[size];

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="relative">
        <div className={`${sz} rounded-full ${darkMode ? 'border-white/5' : 'border-gray-100'} border-2`} />
        <div className={`absolute inset-0 ${sz} rounded-full border-2 border-transparent border-t-indigo-500 border-r-violet-500 animate-spin`} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
        </div>
      </div>
      {label && <p className={`text-xs font-medium tracking-wide ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{label}</p>}
    </div>
  );
};

export default Loader;
