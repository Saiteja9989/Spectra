const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  psflag: {
    type: Number
  },
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  rollno: {
    type: Number,
    required: true
  },
  section: {
    type: String,
    required: true
  },
  dept: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  picture: {
    type: String,
    required: true
  },
  yearofadmision: {
    type: String,
    required: true
  },
  parentphone: {
    type: String,
    required: true
  },
  currentyear: {
    type: Number,
    required: true
  },
  newlogin: {
    type: Number,
    required: true
  },
  snewlogin: {
    type: Number,
    required: true
  },
  hallticketno: {
    type: String,
    required: true
  },
  email: {
    type: Array,
    required: true,
    of: Number
  },
  password: {
    type: String,
    required:false
  }
  
});

const Student = mongoose.model('UpdatedstudentDetail', studentSchema);

module.exports = Student;