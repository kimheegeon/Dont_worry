var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var db = require('../DB_config');
var con = mysql.createConnection({
    host: db.host,
    user: db.user,
    password: db.password,
    database: db.database
  })

/* GET home page. */
router.get('/count', function (req, res, next) {
  var FREE_WORD = req.query.FREE_WORD;
  var START_DATE = req.query.START_DATE;
  var END_DATE = req.query.END_DATE;
  var STATUS_CODE = "00";
  var sql = "SELECT ir.iot_ID iot_ID, ir.address AREA, p.pig COUNT " +
            "FROM IoT_RFID ir, pig p " +
            "WHERE ir.address like ? and " +
                  "p.time >= ? and " +
                  "p.time <= ? and " +
                  "ir.iot_ID = p.iot_ID ";
  con.query(sql, ["%"+FREE_WORD+"%", START_DATE, END_DATE], function (error, results) {
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
