const express = require('express');
const  StudentDetail=require('../models/studentDetails')
const router = express.Router();

router.post('/search', async (req, res) => {
  const searchInput = req.body.searchInput;
  let searchCriteria;
  let field;

  // Determine the search criteria and field based on the input
  if (/^\d{10}$/.test(searchInput)) {
      field = "phone";
      searchCriteria = { phone: searchInput };
  } else if (/^\d+$/.test(searchInput)) {
      field = "phone";
      const partialPhoneNumber = new RegExp('^' + searchInput);
      searchCriteria = { phone: { $regex: partialPhoneNumber } };
  } else if (/^2[a-zA-Z0-9]+$/.test(searchInput)) {
      field = "hallticketno";
      searchCriteria = { hallticketno: { $regex: `^${searchInput}`, $options: 'i' } };
  } else {
      field = "firstname";
      searchCriteria = {
          $or: [
              { firstname: { $regex: searchInput, $options: 'i' } },
          ]
      };
  }

  try {
      // Create a projection object to include only the necessary fields
      const projection = { _id: 1 ,currentyear:1};
      projection[field] = 1; // Dynamically include the selected field

      // Query the database with the search criteria and projection
      const students = await StudentDetail.find(searchCriteria, projection).maxTimeMS(30000);

      res.json(students);
  } catch (error) {
      console.error('Error searching students:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});
  
module.exports = router;