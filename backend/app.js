var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var CronJob = require('cron').CronJob;
var moment = require('moment');
var mysql = require('mysql');
var jsonfile = require('jsonfile');
var cors = require('cors');

var consts = require('../consts.json');
var con = mysql.createConnection({
  host: consts.db.host,
  user: consts.db.user,
  password: consts.db.password,
  database: consts.db.database
})

var pigRouter = require('./routes/pig');
var reportRouter = require('./routes/report');
var weatherRouter = require('./routes/weather');
var waterRouter = require('./routes/water');

var app = express();
app.io = require('socket.io')();
app.use(cors());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/water', waterRouter);
app.use('/weather', weatherRouter);
app.use('/report', reportRouter);
app.use('/pig', pigRouter);


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

// 매일 7시에 전날 측정치를 통해 기준치 설정
new CronJob('0 0 7 * * *', function() {

  sql = "SELECT iot_ID, AVG(turbidity) stan "+
        "FROM water " +
        "WHERE DATE_FORMAT(time, %Y%m%d) =? and " +
        "GROUP BY iot_ID" ;

  con.query(sql,[moment().subtract(1,'days').format("YYYYMMDD")],function(error,results){
    if(error) throw error;
    else{
      results.forEach(element => {
        var data = new Object();
        data.date = moment().format("YYYYMMDD");
        data.standard = results;
        jsonfile.writeFile("./public/standards/standard.json",data,function(){
          if(error) throw error;
        })
      });

    }
  });
  

});

// app.all('/*', function(req, res, next) { 
//   res.header("Access-Control-Allow-Origin", "*"); 
//   res.header("Access-Control-Allow-Headers", "X-Requested-With"); next(); 
// });


app.io.set('origins','*:*');
/* socket io */

app.get("/alert",function(req,res,next){

  console.log(req.query);
  var el = new Object();
  el.standard = req.query.standard;
  el.Location = req.query.Location;
  el.time = moment().format("YYYY-MM-DD HH:mm:ss");
  el.turbidity = req.query.turbidity;
  app.io.emit("alert",JSON.stringify(req.query));

  // app.io.on('connection', function(socket) {
  //   /*
  //   블록체인의 값을 읽어와서 해당값이 기준치를 초과하면 client에 전송
  //   */
  //   // app.get("/alert",function (req, res, next) {
  //   //   console.log(req.query);
  //   //   var alert = req.query;
  //   //   app.io.emit("alert",JSON.stringify(alert));
  //   // });

  //   console.log("socket connect!!");
  //   // console.log(socket);
    
  //   var waterV = ['320','322','322','324','276','58','12','11','11','10','12','11','11','10','12','11','11','10','11','12','12','10','12','11', '11','10','12','12','12','10','12','11','11','10','12','12','12','10'];
    
  //   // console.log(req.query);
  //   // var el = new Object();
  //   // el.standard = req.query.standard;
  //   // el.Location = req.query.Location;
  //   // el.time = moment().format("YYYY-MM-DD HH:mm:ss");
  //   // el.turbidity = req.query.turbidity;
  //   // app.io.emit("alert",JSON.stringify(el));
    
  //   waterV.some(element=>{
  //     if(element<=150){
  //         var el = new Object();
  //         el.Location = "제주혁신성장센터";
  //         el.time = moment().format("YYYY-MM-DD HH:mm:ss");
  //         el.turbidity = element;
  //         app.io.emit("alert",JSON.stringify(el));
  //       }
  //       return element <150
  //   })
  // });
});
module.exports = app;
