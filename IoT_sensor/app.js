var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var jsonfile = require('jsonfile');
var CronJob = require('cron').CronJob;
var request = require('request');
var sync_request = require("sync-request");
var consts = require('./consts.json');
var fs = require('fs');

var SerialPort = require('serialport');
var Readline  = require('@serialport/parser-readline');
var port = new SerialPort('/dev/ttyACM0',{
  baudRate: 9600
    });
var parser = port.pipe(new Readline({delimeter:'\n\r'}));
  

/*
var Readline = require('@serialport/parser-readline');
port.pipe(Readline);
*/
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

var authComplete = false;

  parser.on('data',function(data){
  console.log(data.toString());
  
  if(!authComplete){
 	  Caver.start(data.toString());
 	  authComplete = true;
 	}
   else{
     Caver.addWaterDatas(data.toString());
   
     var c = fs.readFileSync('./consts.json');
     var consts = JSON.parse(c);
     if(data.toString()/consts.standard <0.9){
      var dd = data.toString().replace('\r',"");
      var options = {
        uri:`http://${consts.localhost}:3000/alert`,
        qs:{
          IoT_id:consts.iot_ID,
          turbidity:dd,
          Location:consts.Location,
          standard:consts.standard
        }
      };
       request.get(options,(error,response,body)=>{
         if(error) throw error;
         console.log("alert!!!");
       });
       

//      var res = sync_request('GET', `http://${consts.localhost}:3000/alert?IoT_id=${consts.iot_ID}&turbidity=${dd}&Location=${consts.Location}&standard=${consts.standard}`);
//      console.log(res);
     }
 }   
});

port.on('open',()=>{
  console.log("connect");
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

  request("http://localhost:3000/water/Standard",options,(error,response,body) =>{
    if(error) throw error;
    else{
      jsonfile.writeFile("./consts.json",JSON.parse(response));
    }
  })

});


module.exports = app;
