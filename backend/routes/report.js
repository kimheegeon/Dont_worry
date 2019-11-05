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

  var sql = "SELECT comments CONTENTS, mail USER, time DATE ,address AREA " +
            "FROM report " +
            "WHERE 1=1 ";
  if (FREE_WORD)  sql += `and ir.address like '%${FREE_WORD}%' `;
  if (START_DATE) sql += `and time >= '${START_DATE}' `;
  if (END_DATE)   sql += `and time <= '${END_DATE}'`;

  con.query(sql, function (error, results) {
    if (error) {
      STATUS_CODE = 90;
      throw error;
    }
    else {
      console.log(results);
      var result = new Object();

      result.STATUS_CODE = STATUS_CODE;
      result.AlertedList = results;
      res.json(JSON.stringify(result));
    }
  });


});

router.get('/SendMail', function (req, res, next) {
  var LOCATION = req.query.LOCATION;
  var CONTENTS = req.query.CONTENTS;
  var MAIL = req.query.MAIL_ADDRESS;
  var STATUS_CODE = "00";

  var sql = "INSERT INTO report(comments, mail, address, time) VALUES(?,?,?,?)";
  con.query(sql, [CONTENTS, MAIL, LOCATION, moment().format("YYYY-MM-DD HH:mm:ss")], function (error, results) {
    if (error) {
      STATUS_CODE = "90";
      throw error;
    }
    else {
      var result = new Object();
      result.STATUS_CODE = STATUS_CODE;
      res.json(JSON.stringify(result));
    }
  });


});

module.exports = router;
