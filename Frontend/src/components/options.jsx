import React from 'react';
import { Container, Typography, Grid, Paper, Button, Card, CardContent, Avatar } from '@mui/material';
import { Link } from 'react-router-dom';
import { styled } from '@mui/system';
import { Assignment, BarChart, Feedback, SportsTennis } from '@mui/icons-material';
import { motion } from 'framer-motion';
// import { useNetraID } from '../../netraidcontext';

const StyledCard = styled(Card)(({ theme }) => ({
  width: '800px',
  height: '320px',
  margin: 'auto',
  marginTop: theme.spacing(4),
  textAlign: 'center',
  borderRadius: '10px',
}));

const ProfilePage = () => {
  // const { netraID } = useNetraID(); // Move the hook call inside the component body

  const variants = {
    visible: { opacity: 1, y: 0 },
    hidden: { opacity: 0, y: 50 },
  };

  return (
    <Container maxWidth="xl">
      {/* <Grid container justifyContent="center" alignItems="center" style={{ marginBottom: '40px' }}>
        <StyledCard>
          <CardContent>
            <Avatar alt={} src={} sx={{ width: 100, height: 100, margin: 'auto' }} />
            <Typography variant="h5" gutterBottom>
              {netraID}
            </Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              {netraID}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Roll Number: {netraID}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Year: {netraID}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Section: {netraID}
            </Typography>
          </CardContent>
        </StyledCard>
      </Grid> */}

      <Grid container spacing={3} justifyContent="center">
        {/* Options Section */}
        <Grid item xs={12} sm={6} md={3}>
          <Link to="/attendance" style={{ textDecoration: 'none' }}>
            <motion.div initial="hidden" animate="visible" variants={variants} whileHover={{ scale: 1.1 }}>
              <Paper elevation={3} style={{ padding: '20px', textAlign: 'center', backgroundColor: '#fff', borderRadius: '10px' }}>
                <Assignment fontSize="large" style={{ color: '#3f51b5' }} />
                <Typography variant="h6" gutterBottom style={{ marginTop: '10px', color: '#3f51b5' }}>
                  Attendance
                </Typography>
                <Button variant="contained" fullWidth>
                  View Attendance
                </Button>
              </Paper>
            </motion.div>
          </Link>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Link to="/results" style={{ textDecoration: 'none' }}>
            <motion.div initial="hidden" animate="visible" variants={variants} whileHover={{ scale: 1.1 }}>
              <Paper elevation={3} style={{ padding: '20px', textAlign: 'center', backgroundColor: '#fff', borderRadius: '10px' }}>
                <BarChart fontSize="large" style={{ color: '#3f51b5' }} />
                <Typography variant="h6" gutterBottom style={{ marginTop: '10px', color: '#3f51b5' }}>
                  Results
                </Typography>
                <Button variant="contained" fullWidth>
                  View Results
                </Button>
              </Paper>
            </motion.div>
          </Link>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Link to="/clubs" style={{ textDecoration: 'none' }}>
            <motion.div initial="hidden" animate="visible" variants={variants} whileHover={{ scale: 1.1 }}>
              <Paper elevation={3} style={{ padding: '20px', textAlign: 'center', backgroundColor: '#fff', borderRadius: '10px' }}>
                <SportsTennis fontSize="large" style={{ color: '#3f51b5' }} />
                <Typography variant="h6" gutterBottom style={{ marginTop: '10px', color: '#3f51b5' }}>
                  Clubs
                </Typography>
                <Button variant="contained" fullWidth>
                  View Clubs
                </Button>
              </Paper>
            </motion.div>
          </Link>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Link to="/feedback" style={{ textDecoration: 'none' }}>
            <motion.div initial="hidden" animate="visible" variants={variants} whileHover={{ scale: 1.1 }}>
              <Paper elevation={3} style={{ padding: '20px', textAlign: 'center', backgroundColor: '#fff', borderRadius: '10px' }}>
                <Feedback fontSize="large" style={{ color: '#3f51b5' }} />
                <Typography variant="h6" gutterBottom style={{ marginTop: '10px', color: '#3f51b5' }}>
                  Feedback
                </Typography>
                <Button variant="contained" fullWidth>
                  Give Feedback
                </Button>
              </Paper>
            </motion.div>
          </Link>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProfilePage;
