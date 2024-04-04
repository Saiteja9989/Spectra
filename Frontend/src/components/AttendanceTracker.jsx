import React from 'react';
import './AttendanceTracker.css'; // Assuming CSS file is named styles.css

const DonutChart = ({ attendancePer }) => {
  // Limit percentage to 100
  const percentage = attendancePer > 100 ? 100 : attendancePer;

  // Determine the color based on attendance percentage
  let color;
  if (percentage < 45) {
    color = '#FF0000'; // Red for less than 40%
  } else if (percentage < 65) {
    color = '#FFA500'; // Orange for less than 65%
  } else {
    color = '#00FF00'; // Green for 65% and above
  }

  return (
    <div className="semi-donut">
      <style>
        {`
          .semi-donut {
            --percentage: ${percentage};
            --fill: ${color};
          }
        `}
      </style>
      {attendancePer}%
    </div>
  );
};

export default DonutChart;
