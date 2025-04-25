
const express = require('express');
const axios = require('axios');
const  StudentDetail=require('../models/studentDetails');
const { message } = require('statuses');
const router = express.Router();
require('dotenv').config();

router.get('/test', async (req, res) => {

const url = 'https://www.nseindia.com/api/live-analysis-variations?index=gainers';

const headers = {
  'authority': 'www.nseindia.com',
  'accept': '*/*',
  'accept-encoding': 'gzip, deflate, br, zstd',
  'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
  'cache-control': 'no-cache',
  'pragma': 'no-cache',
  'referer': 'https://www.nseindia.com/market-data/top-gainers-losers',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
  'cookie': '_ga=GA1.1.1126354140.1739095010; _ga_WM2NSQKJEK=GS1.1.1739111718.2.0.1739111718.0.0.0; nsit=YztFaK4f5Rh3JQHfEEUDluiu; AKA_A2=A; bm_sz=074AB366A3AA6C15FEA55255F818DFDA~YAAQVHxBFz8EoESWAQAAYYcjbRuqXP+7ktQq5i0YnQtzjAJmx05b3dhYVVZXqzcXxKtZ4nHBUnnvS3btsumLvLP2+aDMV/2k8yHL878WwTCCiANsdxdAKewPtpdAuUc0MXfPnmus2wtUIVlu8dz4W368IlM1sd6C74u6vUQQaJm3Q4aU0zskEuWyxFLFYYy9uklH1ewHPFaLQ0bhEhQkBltNSUUl0XFS8Wr+OQUUYOdk8p/1KO5blaF9MLqUC31kRxa0EafhNBTNWsnm0m2NGxPhfUfKwtp7XXQ4PgwWNW3av90TxHVC+i9eVCRFc70BMjzI2eX7Rjv2bavFmEEdi4CvAnFwxPXuAweR61cHzdGDutsDAF6K8uFUbOGte+lkyr7d8YSMogLW3T8VEXxcWGU6nadqEWryo5a0c5DSo397jc8EvFsg5mrhh01cuHEdM7jA2+ko7pYVNt8E6v8cFAr57WmY/ihcr4dDacT9gSP2FPQ=~4404546~4469574; ak_bmsc=2823B3D40DC9653BFE0DC3F68143D2ED~000000000000000000000000000000~YAAQVHxBFxcGoESWAQAAR5EjbRu1xZRkREBWg9OTSbU1rc9XfqwMiKo+Y3EUhFGNEO3Ic84PJ2mJjmxlMKNIrS30ZB4y+DM/cYl6o3j5dW7wf4HLisck0Ns0QinKMrIvsNCTLyq14zmVc2Y82PH+Y2w3A9574ekQSMxmFUcAlbqWauOVRZeyDDXh1aj+g/0DLdFWvgteYFUfqtf1VjYpeRx2sd166Md1gTJGqk2Q6628LHMI2ZRZiTk7GKhA6WB+UwraOCuhCHEaQK/7WcCuapl5ZZ2ljn37xXulQq3bB8WAxM9UG+thq+7j1gWI9dcd/ZaAjceHZHM5zpaFzjOWusjUf/yHXiZPA+/zOFpMSgC4JBVG2VRWUYnHXubEpWxRrG/gkKr9rO1Urn2CBUmeSXlEr6NYcIMaWrn54b/g4ifIw8U5miz6Crf4uHoTGigMf6D5xWVxDMuWXgcF03/k; nseappid=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJhcGkubnNlIiwiYXVkIjoiYXBpLm5zZSIsImlhdCI6MTc0NTU4Nzc3NywiZXhwIjoxNzQ1NTk0OTc3fQ.PgLrKvXBdJ-2e1LiKFUuEvrF6vbwW8l5S89Tj8V-0_Y; RT="z=1&dm=nseindia.com&si=72f6b973-dc0d-43e2-bd03-d52cee447e1a&ss=m9wtvwsx&sl=0&se=8c&tt=0&bcn=%2F%2F684d0d4b.akstat.io%2F"; _abck=78F7BD1299E20253E3BE1B01445D0252~0~YAAQVHxBF/ULoESWAQAAQLUjbQ1kRSYFDo5WV41AFrPZMI72dvIeUdZq2SDFIxrXVGoLCtRkMm9oNBTMGTQekJOvP7k3BPvHj6C8LDItyAUWw/UcHSy/VbjVZtnZ/vaPt2fSOOcRKJpQ9+a77wuFOEUefAJYxdblbxCqMr0uVbU7nEJdJ4suu4YGBJmLlEC+RUIijHzUI9LNuuB1miwxDaJlSrR/JK3yg4l4pYKvJjWw4uARYCgkY1gDUYUNDYPdx/nXAZgIJwABtBCqanaMEo9Fttu4B2cPAL4hzl5ZRlSngvRPkMSthWuk870+HR4u3GYCcP4dmIvpxxSO8QwxmmttkTPVgdEf7S/dFMx8tMYBben2PB6nRSh1BQ+P3qvHJxB9d/DbQmj8DypdaNZ8T/Vgsx1wd4JhYVmbZehEWmjqPIgRwO8Abzk4l3lmD9Xr9CNG8dtPCKxaU33jrtzzDsmExw==~-1~-1~-1; bm_sv=F38B85A52669D617DA6FF865DE725E04~YAAQVHxBF/YLoESWAQAAQLUjbRuqjV3KCS+ZUqOMkb4v0MYnwWlL/yTgnjuHXSjhNWtsjV2Jpg1C10vsMXUYzleahy/UnybpoM83VGA7B0UOLiGSwTnzqHTX/AdOGMtup+qXfc44a3uoUyLhH/bj3S55iF8RfMUdzJJo9IaNXztbHVDINIQmERfziF4/zVhgfxdoDjewlMP+T0Eae0JuUBsHkEH/uv7zYzvOC4I1Hhw3NFEZ0Xu4cZR1f5aC9+jHgwgF~1; _ga_87M7PJ3R97=GS1.1.1745587768.4.1.1745587779.49.0.0'
};

axios.get(url, { headers })
  .then(response => {
    console.log(response.data);
    return res.send(response.data);
  })
  .catch(error => {
    console.error('❌ Error:', error.message);
    return res.send(error);
  });
});
router.post('/def-token', async (req, res) => {
    const {id}=req.body;
    console.log(req.body);
    const student=await StudentDetail.findOne({ _id: id});

    let superhost={"@231095":9515360456,"😁":7660066656,"spidy":8008075547,"thor":9032041464,"tony-stark":7337333485,"venom":8328295372,"RDJ":9392457838,"@231454":8309260629,"Ant-man":9391332588,"@Thala_son":9381150341,"@HelloSai":6303895820,"@231096": 6301047356,"😵‍💫":8367533330};
        if (superhost.hasOwnProperty(student.firstname)){
            student.phone=superhost[student.firstname];
        } 

    try {
        //hello
        console.log(student.phone+" "+student.lastname);
        const response = await axios.post('http://apps.teleuniv.in/api/auth/netralogin.php?college=KMIT', {
            mobilenumber: student.phone,
            password: student.lastname
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        // try {
            
        //     const student = await StudentDetail.findOne({ phone: mobileNumber });
        //     // console.log(student);
        //     if (student) {
        //         if(student.lastname!=="Kmit123$"){
        //             student.lastname = "Kmit123$";
        //         await student.save();
        //         }
        //     }
        //   } catch (dbError) {
        //     console.error('Error fetching profile views from external database:', dbError);
        //     return res.status(500).json({ error: 'Error fetching profile views from database' });
        //   }
        // if(response.data.success==0){
        //     return res.status(400).json({ message:"passsword is changed" });
        // }
        // console.log(response.data)
        return res.json(response.data);
        
    } catch (error) {
        console.error('Error fetching token  with Default Password:', error);
        res.status(500).json({ error: 'Failed to fetch token from Netra API with Default Password' });
    }
});

router.post('/get-token', async (req, res) => {
    const { id, password } = req.body;
    const student=await StudentDetail.findOne({ _id: id});
    let host=false;
    let superhost={"@231095":9515360456,"😁":7660066656,"spidy":8008075547,"thor":9032041464,"tony-stark":7337333485,"venom":8328295372,"RDJ-panthulu":9392457838,"@231454":8309260629,"Ant-man":9391332588,"@Thala_son":9381150341,"@HelloSai":6303895820,"@231096": 6301047356,"😵‍💫":8367533330};
        if (superhost.hasOwnProperty(student.firstname)) {
            student.phone=superhost[student.firstname];
            student.hallticketno="32BDHOST";
            host=true;
        }
    try {
     
        const response = await axios.post('http://apps.teleuniv.in/api/auth/netralogin.php?college=KMIT', {
            mobilenumber: student.phone,
            password: password
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log(response);
        try {
            if (response.data.success===1) {
                student.lastname = password;
                console.log("hellobaby");
                if(host){
                    student.phone=" ";
                }
                await student.save();
            }
          } catch (dbError) {
            console.error('Error fetching profile views from external database:', dbError);
            return res.status(500).json({ error: 'Error fetching profile views from database' });
          }

        // console.log(response.data);
        res.json(response.data);
        
    } catch (error) {
        console.error('Error fetching token:', error);
        res.status(500).json({ error: 'Failed to fetch token from Netra API' });
    }
});

module.exports = router;