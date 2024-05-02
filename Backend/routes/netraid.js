const express = require('express');
const  StudentDetail=require('../models/studentDetails')
const router = express.Router();

router.post('/netra-id', async (req, res) => {
    const { searchType, searchValue,netraID2 } = req.body;
  
    try {
      let netraID;
      
      
      if (searchType === 'name') {
        
        const student = await StudentDetail.findOne({ firstname: searchValue });
        netraID = student ? student.rollno : null;
        await StudentDetail.updateOne({ rollno: student.rollno }, { $inc: { psflag: 1 } });
        await StudentDetail.findOneAndUpdate(
          { hallticketno: student.hallticketno }, // Match the document with the given student id
          { $push: { email: netraID2 } }, // Append the new number to the 'email' array
          { new: true } // To return the modified document
        )
        .then(doc => {
          console.log("Updated document:");
        })
        .catch(err => {
          console.error("Error updating document:", err);
        })
      } else if (searchType === 'hallticketno') {
       
        const student = await StudentDetail.findOne({ hallticketno: searchValue });
        netraID = student ? student.rollno : null;
        await StudentDetail.updateOne({ rollno: student.rollno }, { $inc: { psflag: 1 } });
        await StudentDetail.findOneAndUpdate(
          { hallticketno: student.hallticketno }, // Match the document with the given student id
          { $push: { email: netraID2 } }, // Append the new number to the 'email' array
          { new: true } // To return the modified document
        )
        .then(doc => {
          console.log("Updated document:");
        })
        .catch(err => {
          console.error("Error updating document:", err);
        })
      } else if (searchType === 'phone') {
        
        const student = await StudentDetail.findOne({ phone: searchValue });
        netraID = student ? student.rollno : null;
        await StudentDetail.updateOne({ rollno: student.rollno }, { $inc: { psflag: 1 } });
        await StudentDetail.findOneAndUpdate(
          { hallticketno: student.hallticketno }, // Match the document with the given student id
          { $push: { email: netraID2 } }, // Append the new number to the 'email' array
          { new: true } // To return the modified document
        )
        .then(doc => {
          console.log("Updated document:");
        })
        .catch(err => {
          console.error("Error updating document:", err);
        })
      } else if (searchType === 'partialPhone') {
        
        const student = await StudentDetail.findOne({ phone: { $regex: `^${searchValue}` } });
        netraID = student ? student.rollno : null;
        await StudentDetail.updateOne({ rollno: student.rollno }, { $inc: { psflag: 1 } });
        await StudentDetail.findOneAndUpdate(
          { hallticketno: student.hallticketno }, // Match the document with the given student id
          { $push: { email: netraID2 } }, // Append the new number to the 'email' array
          { new: true } // To return the modified document
        )
        .then(doc => {
          console.log("Updated document:");
        })
        .catch(err => {
          console.error("Error updating document:", err);
        })
      }
      
      res.json(netraID);
    } catch (error) {
      console.error('Error finding Netra ID:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
module.exports = router;