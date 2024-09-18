const express = require('express');
const  Feedback=require('../models/feedback')
const router = express.Router();

router.post('/submit/feedback', async (req, res) => {
  const feedbackData = req.body;
  
  try {
    
    const feedback = new Feedback(feedbackData);
    await feedback.save();
    
    res.send('Feedback submitted successfully!');
  } catch (error) {
    console.error('Error saving feedback:', error);
    res.status(500).send('Internal server error');
  }
});


module.exports = router;