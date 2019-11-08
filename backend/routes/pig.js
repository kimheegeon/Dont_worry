var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var consts = require('../consts.json');
var con = mysql.createConnection({
  host: consts.db.host,
  user: consts.db.user,
  password: consts.db.password,
  database: consts.db.database
})

/* GET home page. */
router.get('/count', function (req, res, next) {
  var FREE_WORD = req.query.FREE_WORD;
  var START_DATE = req.query.START_DATE;
  var END_DATE = req.query.END_DATE;
  var STATUS_CODE = "00";
  var sql = "SELECT ir.iot_ID iot_ID, ir.address AREA, p.pig COUNT, p.time " +
            "FROM IoT_RFID ir, pig p " +
            "WHERE ir.iot_ID = p.iot_ID ";
  
  if(FREE_WORD)   sql+=`and ir.address like '%${FREE_WORD}%' `;
  if(START_DATE)  sql+=`and p.time >= '${START_DATE}' `;
  if(END_DATE)    sql+=`and p.time <= '${END_DATE}' `;

  sql += 'ORDER BY p.time desc';

  con.query(sql, function (error, results) {
    if (error) {
      STATUS_CODE = "90";
      throw error;
    }
    else {
      console.log(results);

      var result = new Object();
    
      result.STATUS_CODE = STATUS_CODE;
      result.CountList = results;
      res.json(JSON.stringify(result));
    }
  });


});

module.exports = router;
