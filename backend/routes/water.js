var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var Standard = require('../public/standards/standard.json')
var consts = require('../consts.json');
var con = mysql.createConnection({
  host: consts.db.host,
  user: consts.db.user,
  password: consts.db.password,
  database: consts.db.database
})

router.get('/Standard', function(req,res,next){
    var iot_ID = req.query.iot_ID;


    console.log(iot_ID);
    console.log(Standard.standard);
    var stan =""
    Standard.standard.some(element=>{
        if(element.iot_ID==iot_ID){
            console.log(element.stan);
            stan = element;
        }
    })

    res.json(stan);

});

router.get('/checkWaterQ', function (req, res, next) {
    var LONGITUDE = req.query.LONGITUDE;
    var LATITUDE = req.query.LATITUDE;
    var STATUS_CODE = "00";
    var waterQ = -1;

    // 위도 경도를 x,y로 바꿔서 가장 가까운 iot기기의 address찾기
    var x;
    var y;
    var address;
    address = "서울 서초구 서초동 1623-1"; // 하드코딩


    var sql = "SELECT iw.iot_ID , iw.address , w.turbidity " +
              "FROM IoT_water iw, water w " +
              "WHERE iw.address = ? and " +
                    "iw.iot_ID = w.iot_ID " +
              'ORDER BY TIME desc';


    con.query(sql, [address], function (error, results) {
        if (error) {
            STATUS_CODE = "90";
            throw error;
        }
        else {
            console.log(results);

            if (results.turbidity > 105) waterQ = 3;
            else if (results.turbidity < 95) waterQ = 1;
            else waterQ = 2;

            var data = Object();
            data.STATUS_CODE = STATUS_CODE;
            data.WaterQ = waterQ;

            //바꿔야함
            data.location = address;

            res.json(JSON.stringify(data));
        }

    });


});

router.get('/WaterDetail', function (req, res, next) {
    var AREA = req.query.AREA;
    var DATE = req.query.DATE;
    var STATUS_CODE = "00";
   
    if(!AREA || !DATE ){
        var result = new Object();
        result.STATUS_CODE = "90";
        res.json(JSON.stringify(result));
        return;
    }
    var sql =   "SELECT iw.iot_ID, w.turbidity Turbidity, w.tx_hash transaction " +
                "FROM IoT_water iw, water w " +
                "WHERE  iw.address = ? and " +
                        "iw.iot_ID = w.iot_ID and " +
                        "w.time = ? "
                        
    con.query(sql, [AREA, DATE], function (error, results) {
        if (error) {
            STATUS_CODE = "90";
            throw error;
        }
        else {
            var result = new Object();
            result.STATUS_CODE = STATUS_CODE;
            result.WaterDetail = results[0];
            res.json(JSON.stringify(result));
        }
    });

});

// n개의 iot에서 m개의 수질데이터를 전송
router.get('/WaterQList', function (req, res, next) {
    console.log(req);
    var FREE_WORD = req.query.FREE_WORD;
    var START_DATE = req.query.START_DATE;
    var END_DATE = req.query.END_DATE;
    var STATUS_CODE = "00";
    var WaterQList;

    var sql =   "SELECT iw.iot_ID , iw.address AREA, w.turbidity WATERQ, w.time " +
                "FROM IoT_water iw, water w " +
                "WHERE iw.iot_ID = w.iot_ID ";

    if (FREE_WORD)  sql += `and iw.address like '%${FREE_WORD}%' `;
    if (START_DATE) sql += `and w.time >= '${START_DATE}' `;
    if (END_DATE)   sql += `and w.time <= '${END_DATE}' `;

    sql += 'ORDER BY w.time desc';

    con.query(sql, function (error, results) {
        if (error) {
            STATUS_CODE = "90";
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

})
module.exports = router;
