const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const search = require('./routes/livesearch');
const netraid = require('./routes/netraid');
require('dotenv').config();
const StudentDetail = require('./models/studentDetails');
const Feedback = require('./routes/feedback');
const profile = require('./routes/dashboard');
const subattendance = require('./routes/sub_attendance');
const timetable = require('./routes/timetable');
const internalexam = require('./routes/internalres');
const externalexam = require('./routes/externalres');
const Netraqr = require('./routes/gethallticketnumfromnetraid');
const Fetchqr = require('./routes/fetchqr');
const Getsubjects = require('./routes/getSemSubjects');

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: '*'
};

app.use(cors(corsOptions));

// const validateOrigin = (req, res, next) => {
//   if (req.headers.origin !== '*') {
//       return res.status(403).json({ error: 'Unauthorized request' });
//   }
//   next();
// };

// app.use(validateOrigin);

app.get('/', (req, res) => {
  console.log('requested');
});

app.use('/api', search);
app.use('/api', netraid);
app.use('/api', Feedback);
app.use('/api', profile);
app.use('/api', subattendance);
app.use('/api', timetable);
app.use('/api', internalexam);
app.use('/api', externalexam);
app.use('/api', Netraqr);
app.use('/api', Fetchqr);
app.use('/api', Getsubjects);

// Connect to MongoDB
const db = process.env.CONNECTION;
mongoose.connect(db)
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
