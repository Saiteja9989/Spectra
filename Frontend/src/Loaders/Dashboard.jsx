import React from 'react';
import { useDarkMode } from '../components/DarkModeContext';

const DashboardLoader = () => {
  const { darkMode } = useDarkMode();
  const base = darkMode ? 'bg-gray-700/60' : 'bg-gray-200/80';
  const card = darkMode ? 'bg-gray-800/80 border-white/5' : 'bg-white border-gray-100';

  return (
    <div className="grid grid-cols-12 gap-4 w-full">
      {/* Profile card skeleton */}
      <div className={`col-span-12 md:col-span-4 rounded-2xl border p-5 ${card}`}>
        <div className="flex flex-col items-center gap-3">
          <div className={`w-20 h-20 rounded-2xl ${base} shimmer`} />
          <div className={`h-3.5 w-32 rounded-full ${base} shimmer`} />
          <div className={`h-2.5 w-20 rounded-full ${base} shimmer`} />
          <div className="w-full mt-2 space-y-3">
            {[1,2,3,4].map(i => (
              <div key={i} className="flex justify-between">
                <div className={`h-2.5 w-16 rounded-full ${base} shimmer`} />
                <div className={`h-2.5 w-20 rounded-full ${base} shimmer`} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Attendance card skeleton */}
      <div className={`col-span-12 md:col-span-8 rounded-2xl border p-5 ${card}`}>
        <div className={`h-3.5 w-36 rounded-full ${base} shimmer mb-5`} />
        <div className={`h-3 w-full rounded-full ${base} shimmer mb-6`} />
        <div className="space-y-3">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="flex items-center gap-3">
              <div className={`h-2.5 w-16 rounded-full ${base} shimmer`} />
              <div className="flex gap-1.5">
                {[1,2,3,4,5,6,7].map(j => (
                  <div key={j} className={`w-6 h-6 rounded-lg ${base} shimmer`} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions skeleton */}
      <div className={`col-span-12 rounded-2xl border p-5 ${card}`}>
        <div className={`h-3.5 w-28 rounded-full ${base} shimmer mb-4`} />
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-xl ${base} shimmer`} />
              <div className={`h-2 w-12 rounded-full ${base} shimmer`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardLoader;
