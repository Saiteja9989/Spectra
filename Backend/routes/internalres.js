const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const router = express.Router();

router.use(bodyParser.json());


router.post('/internalResultData', async (req, res) => {
  const { mid, rollno } = req.body;

  try {
    const response = await axios.get('http://teleuniv.in/trinetra/pages/lib/student_ajaxfile.php', {
      params: { mid, rollno },
      // headers: {
      //   'Cookie': '_ga=GA1.2.128655953.1713779717; _ga_1XGBKWGPY0=GS1.1.1713779717.1.0.1713779718.0.0.0',
      //   'Referer': `http://teleuniv.in/trinetra/pages/templates/wrapper/studentmanagement/internalmarks_app.php?sid=${rollno}`
      // },
    });

    // console.log(response.data); // Log the response data
    res.send(response.data);
  } catch (error) {
    console.error('Error fetching internal result data:', error);
    res.status(500).send('Error fetching internal result data');
  }
});
  


module.exports = router;
