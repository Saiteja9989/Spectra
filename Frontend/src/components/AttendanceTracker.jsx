import React from 'react';
import './AttendanceTracker.css'; // Assuming CSS file is named styles.css

const DonutChart = ({ attendancePer }) => {
  
  const percentage = attendancePer > 100 ? 100 : attendancePer;

  
  let color;
  if (percentage < 45) {
    color = '#FF0000'; 
  } else if (percentage < 65) {
    color = '#FFA500'; 
  } else {
    color = '#00FF00'; 
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
