var express = require('express');
var router = express.Router();
var moment = require('moment');
var mysql = require('mysql');
var db = require('../DB_config');
var con = mysql.createConnection({
    host: db.host,
    user: db.user,
    password: db.password,
    database: db.database
  })

/* GET home page. */
router.get('/alertList', function (req, res, next) {
  var FREE_WORD = req.query.FREE_WORD;
  var START_DATE = req.query.START_DATE;
  var END_DATE = req.query.END_DATE;
  var STATUS_CODE = 00;

  var sql = "SELECT comments CONTENTS, mail USER, time DATE "+
            "FROM report "+
            "WHERE address like ? and "+ 
            "time >= ? and "+ 
            "time <= ? "
  con.query(sql, ["%"+FREE_WORD+"%", START_DATE, END_DATE], function (error, results) {
    if (error) {
      STATUS_CODE = 90;
      throw error;
    }
    else {
      console.log(results);
      var result = new Object();
    
      result.STATUS_CODE = STATUS_CODE;
      result.WaterQList = results;
      res.json(JSON.stringify(result));
    }
  });


});

router.get('/SendMail', function (req, res, next) {
  var LOCATION = req.query.LOCATION;
  var CONTENTS = req.query.CONTENTS;
  var MAIL = req.query.MAIL_ADDRESS;
  var STATUS_CODE = "00";

  console.log(moment().format("YYYYMMDDHHmmss"));
  var sql = "INSERT INTO report values(?,?,?,?)";
  con.query(sql, [CONTENTS, MAIL, LOCATION, moment().format("YYYYMMDDHHmmss") ], function (error, results) {
    if (error) {
      STATUS_CODE = "90";
      throw error;
    }
    else {
      console.log(results);
      WaterQList = results;
    }
  });

  var result = new Object();
  result.STATUS_CODE = STATUS_CODE;
  res.json(JSON.stringify(result));

});

module.exports = router;
