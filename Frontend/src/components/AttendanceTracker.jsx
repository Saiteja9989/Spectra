import React from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';
import SemiCircleProgressBar from 'react-progressbar-semicircle';
import './App.css'
function AttendanceTracker({ attendancePercentage }) {
  const normalizedPercentage = (attendancePercentage / 100) * 180;
  const progressColor = attendancePercentage < 51 ? 'red' : attendancePercentage < 75 ? 'orange' : 'green';

  // Add transition effect for the stroke-dasharray property
  const progressBarStyle = {
    transition: 'stroke-dasharray 10000s ease-out', // 100 seconds duration without delay
    stroke: progressColor,
  };
  
  const circularProgressContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  };

  const circularProgressStyle = {
    width: '300px',
    height: '200px',
    position: 'relative',
  };

  const labelStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
  };

  return (
    <Box style={circularProgressContainerStyle}>
      <Box style={circularProgressStyle}>
        <SemiCircleProgressBar
          percentage={attendancePercentage}
          showPercentValue
          diameter={300}
          strokeWidth={20}
          stroke={progressColor} // Inline style for dynamic color
          style={progressBarStyle} // Apply the transition effect
        />
        {/* Uncomment below if you want to show the label inside the semi-circle */}
        {/* <Box style={labelStyle}>
          <Typography variant="h4" style={{ color: progressColor }}>{attendancePercentage}%</Typography>
        </Box> */}
      </Box>
    </Box>
  );
}

export default AttendanceTracker;
