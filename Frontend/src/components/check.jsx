import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Tabs, Tab, Grid, Paper, Box, Button, Drawer, List, ListItem, ListItemText, useMediaQuery, useTheme } from '@mui/material';
import { BatteryFull, Notifications, Search, Person, EventNote, SportsSoccer, Assignment, Feedback, Schedule, Menu } from '@mui/icons-material';
import './App.css'; // Import your CSS file for custom styling
import AttendanceTracker from './AttendanceTracker'; // Import the AttendanceTracker component

function App() {
  const [attendancePercentage, setAttendancePercentage] = useState(0);
  const [userName, setUserName] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    // Simulate fetching user data from an API
    // Replace this with your actual API call
    const fetchUserData = async () => {
      // Simulated user data
      const simulatedUserName = 'John Doe';
      setUserName(simulatedUserName);
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    // Simulate fetching attendance data from an API
    // Replace this with your actual API call
    const fetchAttendanceData = async () => {
      // Simulated attendance percentage
      const simulatedAttendancePercentage = 56;
      setAttendancePercentage(simulatedAttendancePercentage);
    };

    fetchAttendanceData();
  }, []);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setDrawerOpen(open);
  };

  const appBar = (
    <AppBar position="static" className="header">
      <Toolbar>
        {isMobile && (
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
            <Menu />
          </IconButton>
        )}
        <Typography variant="h6" className="app-name">
          {userName}
        </Typography>
        {!isMobile && (
          <>
            <Box sx={{ flexGrow: 1 }} />
            <Tabs>
              <Tab label="Home" />
              <Tab label="About" />
              <Tab label="Contact" />
            </Tabs>
            <IconButton color="inherit">
              <Notifications />
            </IconButton>
            <IconButton color="inherit">
              <Search />
            </IconButton>
          </>
        )}
      </Toolbar>
    </AppBar>
  );

  const drawer = (
    <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
      <List>
        <ListItem button>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="About" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Contact" />
        </ListItem>
      </List>
    </Drawer>
  );

  return (
    <div className="app">
      {appBar}
      {isMobile && drawer}
      {/* Body */}
      <div className="body">
        {/* Attendance Percentage Booster */}
        <div className='desktop-layout'>
          <Paper elevation={3} className="card options-card attendance-tracker shadow-card" style={{ padding: '2%', height: '30vh', width: '95%', position: 'relative' }}>
            {/* Render the AttendanceTracker component here */}
            <AttendanceTracker attendancePercentage={attendancePercentage} />
          </Paper>

          {/* Working Days */}
          <Paper elevation={3} className="card options-card working-days shadow-card" style={{ padding: '2%', height: '20vh', width: '95%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', marginTop: '1vh' }}>
              <Typography variant="body1" style={{ margin: 0 }}>Present: 100</Typography>
              <Typography variant="body1" style={{ margin: 0 }}>Absent: 2</Typography>
              <Typography variant="body1" style={{ margin: 0 }}>Holidays: 5</Typography>
            </Box>
          </Paper>
        </div>
        {/* Options */}
        <Grid container spacing={2}>
          {/* Row 1 */}
          <Grid item xs={6} sm={6} md={4} lg={3}>
            <Paper elevation={3} className="card options-card m1">
              <Box className="option-content" sx={{ display: 'flex', alignItems: 'center' }}>
                <Person className="option-icon" sx={{ marginRight: '8px', marginBottom: '16px' }} />
                <Button variant="contained" color="primary" size="small" sx={{ p: '12px 24px' }}>Profile</Button>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={6} md={4} lg={3}>
            <Paper elevation={3} className="card options-card m1">
              <Box className="option-content" sx={{ display: 'flex', alignItems: 'center' }}>
                <EventNote className="option-icon" sx={{ marginRight: '8px', marginBottom: '16px' }} />
                <Button variant="contained" color="primary" size="small" sx={{ p: '12px 24px' }}>Attendance</Button>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={6} md={4} lg={3}>
            <Paper elevation={3} className="card options-card m1">
              <Box className="option-content" sx={{ display: 'flex', alignItems: 'center' }}>
                <SportsSoccer className="option-icon" sx={{ marginRight: '8px', marginBottom: '16px' }} />
                <Button variant="contained" color="primary" size="small" sx={{ p: '12px 24px' }}>Clubs</Button>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={6} md={4} lg={3}>
            <Paper elevation={3} className="card options-card m1">
              <Box className="option-content" sx={{ display: 'flex', alignItems: 'center' }}>
                <Assignment className="option-icon" sx={{ marginRight: '8px', marginBottom: '16px' }} />
                <Button variant="contained" color="primary" size="small" sx={{ p: '12px 24px' }}>Results</Button>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={6} md={4} lg={3}>
            <Paper elevation={3} className="card options-card m1">
              <Box className="option-content" sx={{ display: 'flex', alignItems: 'center' }}>
                <Feedback className="option-icon" sx={{ marginRight: '8px', marginBottom: '16px' }} />
                <Button variant="contained" color="primary" size="small" sx={{ p: '12px 24px' }}>Feedback</Button>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={6} md={4} lg={3}>
            <Paper elevation={3} className="card options-card m1">
              <Box className="option-content" sx={{ display: 'flex', alignItems: 'center' }}>
                <Schedule className="option-icon" sx={{ marginRight: '8px', marginBottom: '16px' }} />
                <Button variant="contained" color="primary" size="small" sx={{ p: '12px 24px' }}>Timetable</Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default App;
