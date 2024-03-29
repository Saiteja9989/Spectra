const express = require('express');
const  StudentDetail=require('../models/studentDetails')
const router = express.Router();

router.post('/search', async (req, res) => {
    const searchInput = req.body.searchInput;
    let searchCriteria;
  
    // Determine search type based on input format
    if (/^\d{10}$/.test(searchInput)) {
      // Search input is a complete phone number
      searchCriteria = { phone: searchInput };
    } else if (/^\d+$/.test(searchInput)) {
      // Search input is a partial phone number
      const partialPhoneNumber = new RegExp('^' + searchInput);
      searchCriteria = { phone: { $regex: partialPhoneNumber } };
    } else if (/^2[a-zA-Z0-9]+$/.test(searchInput)) {
      // Search input is a hall ticket number
      searchCriteria = { hallticketno: { $regex: `^${searchInput}`, $options: 'i' } };
    } else {
      // Search input is a name (firstname or lastname)
      searchCriteria = {
        $or: [
          { firstname: { $regex: searchInput, $options: 'i' } },
          { lastname: { $regex: searchInput, $options: 'i' } }
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