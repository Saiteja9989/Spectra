import React from 'react';

const LinearProgressBar = ({ attendancePer }) => {
  const percentage = Math.min(attendancePer, 100);

  const getColors = () => {
    if (percentage < 45) return { from: '#ef4444', to: '#dc2626', text: 'text-red-500' };
    if (percentage < 75) return { from: '#f97316', to: '#ea580c', text: 'text-orange-500' };
    return { from: '#22c55e', to: '#16a34a', text: 'text-green-500' };
  };

  const { from, to } = getColors();

  return (
    <div className="w-full">
      <div className="w-full bg-gray-200/60 dark:bg-gray-700/60 rounded-full h-2 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${percentage}%`,
            background: `linear-gradient(90deg, ${from}, ${to})`,
          }}
        />
      </div>
    </div>
  );
};

export default LinearProgressBar;
