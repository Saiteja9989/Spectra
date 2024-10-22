const express = require('express');
const  StudentDetail=require('../models/studentDetails')
const router = express.Router();

router.post('/search', async (req, res) => {
    const searchInput = req.body.searchInput;
    let searchCriteria;
  
    
    if (/^\d{10}$/.test(searchInput)) {
      
      searchCriteria = { phone: searchInput };
    } else if (/^\d+$/.test(searchInput)) {
      
      const partialPhoneNumber = new RegExp('^' + searchInput);
      searchCriteria = { phone: { $regex: partialPhoneNumber } };
    } else if (/^2[a-zA-Z0-9]+$/.test(searchInput)) {
      
      searchCriteria = { hallticketno: { $regex: `^${searchInput}`, $options: 'i' } };
    } else {
      
      searchCriteria = {
        $or: [
          { firstname: { $regex: searchInput, $options: 'i' } },
          
        ]
      };
    }
  
    try {
      const students = await StudentDetail.find(searchCriteria).maxTimeMS(30000);
      res.json(students);
    } catch (error) {
      console.error('Error searching students:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});
  
module.exports = router;