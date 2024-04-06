// feedbackModel.js
const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  rating: {
    type: Number,
    required: true
  },
  netraID: {
    type: Number,
    required:true
  },
  name: {
    type: String,
    required: true
  },
  comments: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
