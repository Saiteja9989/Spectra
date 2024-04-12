const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require("cors");
const search = require("./routes/livesearch")
const netraid= require('./routes/netraid')
require('dotenv').config();
const StudentDetail = require('./models/studentDetails')
const Feedback = require('./routes/feedback')
// const Netra = require('./routes/netra')
const profile = require('./routes/dashboard')
const subattendance = require('./routes/sub_attendance')
const timetable = require('./routes/timetable')
const internalexam = require('./routes/internalres')
const externalexam= require('./routes/externalres')

const app = express();
const PORT = process.env.PORT || 5000  ;
app.use(cors({
  origin: '*', // Change this to your React app's URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Enable credentials (if required)
}));

// Allow requests only from specific origins
const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

app.use(cors({
  origin: '*'
}));

// app.use('/', (req, res) => {
//   res.json({message:"hello server started"})
// })

// app.use(cors({
//   origin: 'http://localhost:5173',
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   credentials: true,
// }));
// Enable CORS for all routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Update to match the domain you will make the request from
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Bodyparser Middleware
app.use(bodyParser.json());

app.use('/api', search)
app.use('/api', netraid)
app.use('/api', Feedback)
app.use('/api', profile)
app.use('/api', subattendance)
app.use('/api', timetable)
app.use('/api', internalexam)
app.use('/api',externalexam)





// DB Config
const db = process.env.CONNECTION

// app.post('/search', async (req, res) => {
//   const searchInput = req.body.searchInput;
//   let searchCriteria;
//,
//   // Determine search type based on input format
//   if (/^\d{10}$/.test(searchInput)) {
//     // Search input is a complete phone number
//     searchCriteria = { phone: searchInput };
//   } else if (/^\d+$/.test(searchInput)) {
//     // Search input is a partial phone number
//     const partialPhoneNumber = new RegExp('^' + searchInput);
//     searchCriteria = { phone: { $regex: partialPhoneNumber } };
//   } else if (/^2[a-zA-Z0-9]+$/.test(searchInput)) {
//     // Search input is a hall ticket number
//     searchCriteria = { hallticketno: { $regex: `^${searchInput}`, $options: 'i' } };
//   } else {
//     // Search input is a name (firstname or lastname)
//     searchCriteria = {
//       $or: [
//         { firstname: { $regex: searchInput, $options: 'i' } },
//         { lastname: { $regex: searchInput, $options: 'i' } }
//       ]
//     };
//   }

//   try {
//     const students = await StudentDetail.find(searchCriteria).maxTimeMS(30000);
//     res.json(students);
//   } catch (error) {
//     console.error('Error searching students:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });




// app.post('/netra-id', async (req, res) => {
//   const { searchType, searchValue } = req.body;

//   try {
//     let netraID;
    
//     // Logic to find the Netra ID based on the search type and value
//     if (searchType === 'name') {
//       // Search logic based on name
//       const student = await StudentDetail.findOne({ firstname: searchValue });
//       netraID = student ? student.rollno : null;
//     } else if (searchType === 'hallticketno') {
//       // Search logic based on hall ticket number
//       const student = await StudentDetail.findOne({ hallticketno: searchValue });
//       netraID = student ? student.rollno : null;
//     } else if (searchType === 'phone') {
//       // Search logic based on phone number
//       const student = await StudentDetail.findOne({ phone: searchValue });
//       netraID = student ? student.rollno : null;
//     } else if (searchType === 'partialPhone') {
//       // Search logic based on partial phone number
//       const student = await StudentDetail.findOne({ phone: { $regex: `^${searchValue}` } });
//       netraID = student ? student.rollno : null;
//     }

//     // Send the Netra ID back to the frontend
//     res.json(netraID);
//   } catch (error) {
//     console.error('Error finding Netra ID:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// Connect to MongoDB
mongoose.connect(db)
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.error('MongoDB connection error:', err));




app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
