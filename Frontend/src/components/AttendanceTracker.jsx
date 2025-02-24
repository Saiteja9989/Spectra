import React from 'react';

const LinearProgressBar = ({ attendancePer }) => {
  // Ensure percentage is within 0-100 range
  const percentage = attendancePer > 100 ? 100 : attendancePer;

  // Determine the color based on the attendance percentage
  let color;
  if (percentage < 45) {
    color = '#FF0000'; // Red for 0-45%
  } else if (percentage < 75) {
    color = '#FFA500'; // Orange for 45-65%
  } else {
    color = '#00FF00'; // Green for 65% and above
  }

  return (
    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-1000 ease-out"
        style={{
          width: `${percentage}%`,
          backgroundColor: color,
        }}
      />
      <div className="text-center text-xs mt-1 text-gray-700">
        {percentage}%
      </div>
    </div>
  );
};

export default LinearProgressBar;