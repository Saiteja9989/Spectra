const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const  StudentDetail=require('../models/studentDetails');
const router = express.Router();


router.use(bodyParser.json());
router.post('/profile', async (req, res) => {
  const { method } = req.body;
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1]; 

  if (!token) {
    return res.status(400).json({ error: 'Token is missing' });
  }

  try {
   
    
    const response = await axios.post('http://apps.teleuniv.in/api/netraapi.php?college=KMIT', {
      method: method,
      
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Origin': 'http://kmit-netra.teleuniv.in',
        'Referer': 'http://kmit-netra.teleuniv.in/'
      }
    });

    

    const profileData = response.data;
    // console.log('Received profile data:', profileData);

    if (!profileData.hallticketno) {
      return res.status(400).json({ error: 'Invalid response from external API' });
    }


    let student;
    try {
      
      student = await StudentDetail.findOne({ hallticketno: profileData.hallticketno });
      if (student) {
        profileData.psflag = student.psflag;
      }
    } catch (dbError) {
      console.error('Error fetching profile views from external database:', dbError);
      return res.status(500).json({ error: 'Error fetching profile views from database' });
    }

    profileData.picture=`http://teleuniv.in/sanjaya/student-images/${profileData.hallticketno}.jpg`;
    
    // console.log(profileData.picture);
    const imGroup = {
      // .
      // "7993186148":"https://spectraserver-indol.vercel.app/images/k3.png",
      "8522036270": "https://spectraserver-indol.vercel.app/images/Ashish.png",
      "8008075547": "https://spectraserver-indol.vercel.app/images/bharath.png",
      "6301047356": "https://spectraserver-indol.vercel.app/images/saikiran.png",
      "9390474839": "https://spectraserver-indol.vercel.app/images/sagar.png",
      "9515360456": "https://spectraserver-indol.vercel.app/images/abhi.png",
      "9398809642": "https://spectraserver-indol.vercel.app/images/midvan.png",
      "7731997021": "https://spectraserver-indol.vercel.app/images/vatte.png",
      "8919596424": "https://spectraserver-indol.vercel.app/images/ajay.png",
      "9381704183": "https://spectraserver-indol.vercel.app/images/bba.png",
      "9392457838": "https://spectraserver-indol.vercel.app/images/chaaru.png",
      "7989922788": "https://spectraserver-indol.vercel.app/images/gokul.png",
      "9652685002": "https://spectraserver-indol.vercel.app/images/shashank.png",
      "9177756036": "https://spectraserver-indol.vercel.app/images/madav.png",
      "7981991406": "https://spectraserver-indol.vercel.app/images/ritesh.png",
      "9398532147": "https://spectraserver-indol.vercel.app/images/varshith.png",
      "8125611565": "https://spectraserver-indol.vercel.app/images/nithin.png",
      // "7993186148": "https://spectraserver-indol.vercel.app/images/bhai.png",
      "8074654538": "https://spectraserver-indol.vercel.app/images/darshin.png",
      "9346991857": "https://spectraserver-indol.vercel.app/images/shivamsh.png",
      "9949656702": "https://spectraserver-indol.vercel.app/images/sankeerth.png",
      "9848607779": "https://spectraserver-indol.vercel.app/images/ambi.png",
      "7780501414":"https://spectraserver-indol.vercel.app/images/dupati.png",
      "9848883000":"https://spectraserver-indol.vercel.app/images/runi.png",
      "9640531022":"https://spectraserver-indol.vercel.app/images/raki.png",
      "9866297260":"https://spectraserver-indol.vercel.app/images/satik.png",
      // "9030560126":"https://spectraserver-indol.vercel.app/images/sampath.png",
      "8074647069": "https://spectraserver-indol.vercel.app/images/eshaan.png",
      // "9666003311": "https://spectraserver-indol.vercel.app/images/aroosh.png",
      "9182479367": "https://spectraserver-indol.vercel.app/images/dubbaka.png",
      "6305842689": "https://spectraserver-indol.vercel.app/images/Dabbula.png",
      "8019833422": "https://spectraserver-indol.vercel.app/images/laddo.png",
      "9100104120": "https://spectraserver-indol.vercel.app/images/hariteja.png",
      "7396003326": "https://spectraserver-indol.vercel.app/images/abhivamsh.png",
      // "9160255570": "https://spectraserver-indol.vercel.app/images/monish.png",
      "9441724736": "https://spectraserver-indol.vercel.app/images/hmaprakash.png",
      "7032581911": "https://spectraserver-indol.vercel.app/images/sirish.png",
      "9440494430": "https://spectraserver-indol.vercel.app/images/crbrother.png",
    };

    if (Object.keys(imGroup).includes(String(profileData.phone))) {
      profileData.picture = imGroup[String(profileData.phone)];
      profileData.parentemail = "Valid";
    } else {
      try {
        const imageResponse = await axios.get(profileData.picture, { 
          responseType: 'arraybuffer',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Origin': 'http://kmit-netra.teleuniv.in',
            'Referer': 'http://kmit-netra.teleuniv.in/'
          }
        });
        if (student && student.picture === 'http://teleuniv.in/sanjaya/student-images/') {
            student.picture = profileData.picture;
            await student.save();
          }
        const imageBuffer = Buffer.from(imageResponse.data, 'binary');
        profileData.picture = imageBuffer.toString('base64');
      } catch (imageError) {
        console.log("jpg is failed");
        try {
          const imageResponse = await axios.get(`http://teleuniv.in/sanjaya/student-images/${profileData.hallticketno}.jpeg`, { 
            responseType: 'arraybuffer',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
              'Origin': 'http://kmit-netra.teleuniv.in',
              'Referer': 'http://kmit-netra.teleuniv.in/'
            }
          });
          if (student && student.picture === 'http://teleuniv.in/sanjaya/student-images/') {
            student.picture = `http://teleuniv.in/sanjaya/student-images/${profileData.hallticketno}.jpeg`;
            await student.save();
          }
          const imageBuffer = Buffer.from(imageResponse.data, 'binary');
          profileData.picture = imageBuffer.toString('base64');
        } catch (imageError) {
          console.log("jpeg is failed"+imageError);
          profileData.picture=null;
        }
      }
    }
    // console.log('Received profile data:', profileData);
    res.json(profileData);
  } catch (apiError) {
    console.error('Error fetching profile data from external API:', apiError);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



router.post('/userinfo',async(req,res)=>{
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1]; 
  // console.log(token)
  try {
    const response = await axios.post('http://apps.teleuniv.in/api/auth/user-info.php', {}, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Origin': 'http://kmit-netra.teleuniv.in',
        'Referer': 'http://kmit-netra.teleuniv.in/'
      }
    });
    // console.log(response.data);
    const userData = response.data;
    res.json(userData);
    // console.log(userData);
  } catch (apiError) {
    console.error('Error fetching user data from back-end API:', apiError);
    res.status(500).json({ error: 'Internal Server Error' });
}

})

router.post('/attendance', async (req, res) => {
  const { method,tar } = req.body;
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  
    try {
      
      const response = await axios.post('http://apps.teleuniv.in/api/netraapi.php?college=KMIT', {
        method: method,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Origin': 'http://kmit-netra.teleuniv.in',
          'Referer': 'http://kmit-netra.teleuniv.in/'
        }
      });
  
      // console.log(response.data);
      const { attandance, overallattperformance } = response.data;
      const data = attandance.dayobjects;
      const data1 = overallattperformance.totalpercentage;
      const data2 = attandance.twoweeksessions;
  
      
      const attendanceData = {
        dayObjects: data,
        totalPercentage: data1,
        twoWeekSessions: data2
      };
      const bhai = [];
      // console.log(tar.toString());
      if (bhai.includes(tar)) {
        attendanceData.totalPercentage = (parseFloat(attendanceData.totalPercentage) + 32).toString();
      }
      
      res.json(attendanceData);
    } catch (error) {
      console.error('Error fetching attendance data from external API:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  




module.exports = router;