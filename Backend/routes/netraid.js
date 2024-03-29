const express = require('express');
const  StudentDetail=require('../models/studentDetails')
const router = express.Router();

router.post('/netra-id', async (req, res) => {
    const { searchType, searchValue } = req.body;
  
    try {
      let netraID;
      
      // Logic to find the Netra ID based on the search type and value
      if (searchType === 'name') {
        // Search logic based on name
        const student = await StudentDetail.findOne({ firstname: searchValue });
        netraID = student ? student.rollno : null;
      } else if (searchType === 'hallticketno') {
        // Search logic based on hall ticket number
        const student = await StudentDetail.findOne({ hallticketno: searchValue });
        netraID = student ? student.rollno : null;
      } else if (searchType === 'phone') {
        // Search logic based on phone number
        const student = await StudentDetail.findOne({ phone: searchValue });
        netraID = student ? student.rollno : null;
      } else if (searchType === 'partialPhone') {
        // Search logic based on partial phone number
        const student = await StudentDetail.findOne({ phone: { $regex: `^${searchValue}` } });
        netraID = student ? student.rollno : null;
      }
  
      // Send the Netra ID back to the frontend
      res.json(netraID);
    } catch (error) {
      console.error('Error finding Netra ID:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
module.exports = router;