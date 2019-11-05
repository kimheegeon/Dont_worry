var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cron = require('node-cron');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var Caver = require('./caver');
var rc522 = require("rc522");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var authComplete = false;
var list = [];
var pigCnt = 0;
cron.schedule('*/8 * * * * *', function () {
  list = [];
  if(!authComplete){
    Caver.start(pigCnt);
    authComplete = true;
  }else{
    Caver.putPigCnt(pigCnt);
  }
  pigCnt = 0;
}).start();

rc522(function(rfidSerialNumber){
  console.log("List",list);
  if(list.indexOf(rfidSerialNumber) >= 0){
	//do nothing
	console.log("already in!");
  } else if(list.indexOf(rfidSerialNumber) == -1){
	list.push(rfidSerialNumber);
  }
  pigCnt = list.length;
});

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

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

module.exports = app;
