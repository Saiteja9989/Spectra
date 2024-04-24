const express = require('express');
const  StudentDetail=require('../models/studentDetails')
const router = express.Router();

router.post('/netra-id', async (req, res) => {
    const { searchType, searchValue } = req.body;
  
    try {
      let netraID;
      
      
      if (searchType === 'name') {
        
        const student = await StudentDetail.findOne({ firstname: searchValue });
        netraID = student ? student.rollno : null;
      } else if (searchType === 'hallticketno') {
       
        const student = await StudentDetail.findOne({ hallticketno: searchValue });
        netraID = student ? student.rollno : null;
      } else if (searchType === 'phone') {
        
        const student = await StudentDetail.findOne({ phone: searchValue });
        netraID = student ? student.rollno : null;
      } else if (searchType === 'partialPhone') {
        
        const student = await StudentDetail.findOne({ phone: { $regex: `^${searchValue}` } });
        netraID = student ? student.rollno : null;
      }
  
      
      res.json(netraID);
    } catch (error) {
      console.error('Error finding Netra ID:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
module.exports = router;