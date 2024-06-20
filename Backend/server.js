const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

// Import route handlers
const search = require('./routes/livesearch');
const netraid = require('./routes/netraid');
const feedback = require('./routes/feedback');
const profile = require('./routes/dashboard');
const subattendance = require('./routes/sub_attendance');
const timetable = require('./routes/timetable');
const internalexam = require('./routes/internalres');
const externalexam = require('./routes/externalres');
const netraqr = require('./routes/gethallticketnumfromnetraid');
const fetchqr = require('./routes/fetchqr');
const getSubjects = require('./routes/getSemSubjects');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
}));

app.use(bodyParser.json()); // To parse JSON bodies

// Test route
app.get('/', (req, res) => {
  res.send('Backend uploaded..');
});

// Use the imported routes
app.use('/api/search', search);
app.use('/api/netraid', netraid);
app.use('/api/feedback', feedback);
app.use('/api/profile', profile);
app.use('/api/subattendance', subattendance);
app.use('/api/timetable', timetable);
app.use('/api/internalexam', internalexam);
app.use('/api/externalexam', externalexam);
app.use('/api/netraqr', netraqr);
app.use('/api/fetchqr', fetchqr);
app.use('/api/getSubjects', getSubjects);

// Connect to MongoDB
const db = process.env.CONNECTION;
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.error('MongoDB connection error:', err));

// Start the server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
