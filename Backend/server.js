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
// const getSubjects = require('./routes/getSemSubjects');

const app = express();

// CORS configuration

app.use(cors({
  origin: 'https://spectra-ewa1.vercel.app', // Allow specific origin
  methods: ['GET', 'POST'],                  // Allow specific HTTP methods
  credentials: true                          // Allow credentials if needed
}));

app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
}));

app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.send('Backend uploaded..');
});


app.use('/api', search);
app.use('/api', netraid);
app.use('/api', feedback);
app.use('/api', profile);
app.use('/api', subattendance);
app.use('/api', timetable);
app.use('/api', internalexam);
app.use('/api', externalexam);
app.use('/api', netraqr);
app.use('/api', fetchqr);
// app.use('/api', getSubjects);

const db = process.env.CONNECTION;
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.error('MongoDB connection error:', err));


app.listen(5000, () => console.log(`Server started on port 5000`));
