var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var jsonfile = require('jsonfile');
var CronJob = require('cron').CronJob;
var request = require('request');
var consts = require('./consts.json');
var jsonfile = require('jsonfile');


var Caver = require('./caver');
var mcpadc = require('mcp-spi-adc');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const tempSensor = mcpadc.open(6, err => {
  if (err) throw err;
  var authComplete = false;

  setInterval(_ => {
    tempSensor.read((err, reading) => {
      if (err) throw err;
      //console.log((reading.value * 3.3 - 0.5) * 100);
	var value = reading.value * 100;
	var value_round = Math.round(value);
	console.log(value_round);
	if(!authComplete){
	  Caver.start(value_round);
	  authComplete = true;
	}
        else{
	  Caver.addWaterDatas(value_round);
	}
    });
  }, 8000);
});


//get standard
new CronJob('0 30 7 * * *', function() {
  
  var options ={
    method:"GET",
    url: "localhost:3000/water/Standard",
    body:{
      iot_ID :consts.iot_ID 
    }

  }

  request("http://localhost:3000",options,(error,response,body) =>{
    if(error) throw error;

  })

});


module.exports = app;
