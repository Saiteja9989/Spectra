import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Button, Grid, Typography } from '@mui/material';

function OptionsPage() {
  return (
    <Container maxWidth="md" style={{ marginTop: '50px' }}>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12}>
          <Typography variant="h5" align="center" gutterBottom>
            Select an Option
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Link to="/profile" style={{ textDecoration: 'none' }}>
            <Button variant="contained" color="primary" fullWidth size="large">
              View Profile
            </Button>
          </Link>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Link to="/attendance" style={{ textDecoration: 'none' }}>
            <Button variant="contained" color="primary" fullWidth size="large">
              Check Attendance
            </Button>
          </Link>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Link to="/results" style={{ textDecoration: 'none' }}>
            <Button variant="contained" color="primary" fullWidth size="large">
              View Results
            </Button>
          </Link>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Link to="/feedback" style={{ textDecoration: 'none' }}>
            <Button variant="contained" color="primary" fullWidth size="large">
              Provide Feedback
            </Button>
          </Link>
        </Grid>
      </Grid>
    </Container>
  );
}

export default OptionsPage;
