var express = require('express');
var router = express.Router();
var request = require('request');
var moment = require('moment');
/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log('weather start!');
  console.log(moment().format("YYYYMMDD")) ;
  var qs ='ServiceKey=eYOi57KhdUa3ajQmj%2BfrHhSxQs%2BrC9i534EuIPH4FURXXIHo%2FmeS75vQk3I5u9m%2FmAeS%2BQsqGUbVfinOKsHOLg%3D%3D'
          +'&base_date='+moment().format("YYYYMMDD")
          +'&base_time=0500'
          +'&nx=55'
          +'&ny=127'
          +'&_type=json';
  request.get('http://newsky2.kma.go.kr/service/SecndSrtpdFrcstInfoService2/ForecastSpaceData?'+qs, function (error, response, body) {
  console.log('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  // console.log('body:', body); // Print the HTML for the Google homepage.
  res.send(body);
  var obj = JSON.parse(body);
  
  console.log(obj.response.header.resultMsg);
  });

});

router.get('/list', function(req, res, next) {
  

});

module.exports = router;
