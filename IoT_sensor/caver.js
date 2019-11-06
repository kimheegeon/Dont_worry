const Caver = require('caver-js')
const moment = require('moment')
const nconf = require('nconf')
var mysql = require('mysql');
var db = require('./DB_config');
var request = require('request');
var consts = require('./consts.json');

var con = mysql.createConnection({
  host: db.host,
  user: db.user,
  password: db.password,
  database: db.database
})

nconf.argv().env().file({file: './scdefault.json'});
const auth = nconf.get('auth');
const abi = nconf.get('abi');
const address = nconf.get('address');

const config = {
  rpcURL : 'https://api.baobab.klaytn.net:8651',
}

const cav = new Caver(config.rpcURL);
const agContract = new cav.klay.Contract(abi, address);
const caver = {
  auth: {
    accessType : 'keystore'
  },

  start: async function (waterVal) {
    caver.handleLogin(waterVal);
  },

  handleLogin: async function (waterVal) {
    if(this.auth.accessType === 'keystore'){
      try{
        const privateKey = cav.klay.accounts.decrypt(auth.keystore, auth.password).privateKey;
        this.integrateWallet(privateKey);
        caver.addWaterDatas(waterVal);
      } catch (e){
        console.log("handleLogin error : ", error);
      }
    }
  },

  getWallet: function () {
    if(cav.klay.accounts.wallet.length){
      return cav.klay.accounts.wallet[0];
    }
  },

  integrateWallet: function (privateKey) {
    const walletInstance = cav.klay.accounts.privateKeyToAccount(privateKey);
    cav.klay.accounts.wallet.add(walletInstance);
  },

  addWaterDatas: async function(waterVal) {
    const walletInstance = await this.getWallet();
    const nowTime = moment().format("HHmmss");
    const nowDate = moment().format("YYMMDD");
    const waterIoTIP = '123.123.123.123'; //example ip address
    const waterValue = '' + waterVal;

    console.log("waterVal: ",waterVal)

    agContract.methods.addWaterData(waterIoTIP, nowDate, waterValue, nowTime).send({
      from : walletInstance.address,
      gas : '250000',
    }, function(error, result){
      if(error) console.log("err : ", error);
    })
    .once('transactionHash', (txHash) => {
      console.log(`txHash: ${txHash}`);

      // if(watervalue<consts.standard){
      //   request.get(`http://localhost:3000/alert?turbidity=${waterValue}&standard=${consts.standard}&Location=${consts.Location}`);
      // }

      //sql = "INSERT INTO water(iot_ID,turbidity,time,waterq,tx_hash) values(?,?,now(),?,?)";
      //con.query(sql,[2,waterVal,40,txHash],function(error,results){
       // if(error) throw error;
      //});
    });
    
  },

};

module.exports = caver;