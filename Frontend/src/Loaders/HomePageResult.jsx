import React from 'react';
import { useDarkMode } from '../components/DarkModeContext';

const HomePageResult = () => {
  const { darkMode } = useDarkMode();
  const base = darkMode ? 'bg-gray-700/60' : 'bg-gray-200/80';

  return (
    <div className="w-full space-y-3 px-1">
      {[1, 2, 3].map(i => (
        <div key={i} className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full ${base} shimmer flex-shrink-0`} />
          <div className="flex-1 space-y-1.5">
            <div className={`h-3 rounded-full ${base} shimmer`} style={{ width: `${55 + i * 10}%` }} />
            <div className={`h-2.5 rounded-full ${base} shimmer`} style={{ width: `${30 + i * 8}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default HomePageResult;
