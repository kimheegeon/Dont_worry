var express = require('express');
var router = express.Router();
var moment = require('moment');

/* GET home page. */
router.get('/', function (req, res, next) {
  console.log("alert!");
  res.send(1234);
});



module.exports = router;
