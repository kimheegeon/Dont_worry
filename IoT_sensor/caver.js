const Caver = require('caver-js')

const config = {
  rpcURL : 'https://api.baobab.klaytn.net:8651',
}

const abi = [{"constant":true,"inputs":[],"name":"IoTCnt","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"waterIoTList","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"waterQuality","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"rfidList","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"constant":true,"inputs":[{"name":"_IotIp","type":"string"}],"name":"checkIotIdx","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_IotIp","type":"string"},{"name":"_day","type":"string"},{"name":"_waterQuality","type":"string"},{"name":"_measureTime","type":"string"}],"name":"addWaterData","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_IotIp","type":"string"},{"name":"_day","type":"string"}],"name":"getWaterData","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_day","type":"string"},{"name":"_dayBefore","type":"string"}],"name":"getLatestDataList","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getWaterIoTIps","outputs":[{"name":"","type":"string[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getRfidIPs","outputs":[{"name":"","type":"string[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_rfidIp","type":"string"},{"name":"_pigCnt","type":"string"},{"name":"_time","type":"string"}],"name":"putPigCnt","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_rfidIp","type":"string"}],"name":"getOnePigCnt","outputs":[{"name":"","type":"string"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_rfidIp","type":"string"}],"name":"getAllPigCntList","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function"}];

const cav = new Caver(config.rpcURL);
const agContract = new cav.klay.Contract(abi, '0xe2fc93e2402304053b187c955b6feb605d6c5f88');
const caver = {
  auth: {
    accessType : 'keystore',
    keystore: {
      "version": 3,
      "id": "1ed738f1-da6c-48a5-b4bf-58421fea707b",
      "address": "0x6cffac0ad29317a642a88e7ffdbfb0541f2d0235",
      "crypto": {
        "ciphertext": "1144f653e735c989a7098e108a3b96e75d0138524bcfb3a14be3aa0bc35ff57a",
        "cipherparams": {
          "iv": "c50d3ce17ab610c443d631f7a116aee8"
        },
        "cipher": "aes-128-ctr",
        "kdf": "scrypt",
        "kdfparams": {
          "dklen": 32,
          "salt": "532053237b9fbbfa8bc05dee8ec3da30501d0f1ec825efc922cf1deff2520745",
          "n": 4096,
          "r": 8,
          "p": 1
        },
        "mac": "df70daaa88d3b13d303d62e68f5f3186bdd4271c5739fc782e05425330fa586a"
      }
    },
    password: 'test1234!'
  },

  start: async function () {
    caver.handleLogin();
  },

  handleLogin: async function () {
    if(this.auth.accessType === 'keystore'){
      try{
        const privateKey = cav.klay.accounts.decrypt(this.auth.keystore, this.auth.password).privateKey;
        this.integrateWallet(privateKey);
        caver.addWaterDatas();
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

  addWaterDatas: async function() {
    const walletInstance = await this.getWallet();
    const date = new Date();
    const nowTime = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    const nowDate = date.getYear().toString().slice(1,3) + (date.getMonth()+1) + date.getDate();
    const waterIoTIP = '123.123.123.123'; //example ip address
    const waterValue = '201'; //example water value

    agContract.methods.addWaterData(waterIoTIP, nowDate, waterValue, nowTime).send({
      from : walletInstance.address,
      gas : '250000',
    }, function(error, result){
      if(error) console.log("err : ", error);
    })
    .once('transactionHash', (txHash) => {
      console.log(`txHash: ${txHash}`);
    })
    .once('receipt', (receipt) => {
      console.log(`(#${receipt.blockNumber})`, receipt);
    });

    //여기서 수질 데이터와 시간, 날짜, txHash값을 데이터베이스에 저장해야한다.
  },

};

module.exports = caver;