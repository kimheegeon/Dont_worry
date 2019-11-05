const Caver = require('caver-js')
const nconf = require('nconf')
var mysql = require('mysql');
var db = require('./DB_config');

var con = mysql.createConnection({
  host: db.host,
  user: db.user,
  password: db.password,
  database: db.database
})

const config = {
  rpcURL : 'https://api.baobab.klaytn.net:8651',
}

nconf.argv().env().file({file: './scdefault.json'});
const auth = nconf.get('auth');
const abi = nconf.get('abi');
const address = nconf.get('address');

const cav = new Caver(config.rpcURL);
const agContract = new cav.klay.Contract(abi, address);

const caver = {
  auth: {
    accessType : 'keystore'
  },
  start: async function (pigCnt) {
    if(!auth.complete){
      caver.handleLogin(pigCnt);
      auth.complete = true;
    }
    else{
      caver.putPigCnt(pigCnt);
    }
    
  },

  handleLogin: async function (pigCnt) {
    if(this.auth.accessType === 'keystore'){
      try{
        const privateKey = cav.klay.accounts.decrypt(auth.keystore, auth.password).privateKey;
        this.integrateWallet(privateKey);
        caver.putPigCnt(pigCnt);
      } catch (error){
        console.log("error : ", error);
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

  putPigCnt: async function(pigCnt) {
    const walletInstance = this.getWallet();
    const time = new Date().toString();
    const rfidIP = '121.234.211.12';  //example ip address
    const pigCount = '' + pigCnt;
    console.log("pigCnt: ", pigCount);
    
    await agContract.methods.putPigCnt(rfidIP, pigCount, time).send({
      from : walletInstance.address,
      gas : '250000',
    }, function(error, result){
      if(error) console.log("err : ", error);
    })
    .once('transactionHash', (txHash) => {
      console.log(`txHash: ${txHash}`);

      sql = "INSERT INTO pig(iot_ID,pig,time,tx_hash) values(?,?,now(),?)";
      con.query(sql,[1, pigCount, txHash],function(error,results){
        if(error) throw error;
      });
    });
  }
};

module.exports = caver;