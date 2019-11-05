const Caver = require('caver-js')
const nconf = require('nconf')

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
  start: async function () {
    if(!auth.complete){
      caver.handleLogin();
      auth.complete = true;
    }
    else{
      caver.putPigCnt();
    }
    
  },

  handleLogin: async function () {
    if(this.auth.accessType === 'keystore'){
      try{
        const privateKey = cav.klay.accounts.decrypt(auth.keystore, auth.password).privateKey;
        this.integrateWallet(privateKey);
        caver.putPigCnt();
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

  putPigCnt: async function() {
    const walletInstance = this.getWallet();
    const time = new Date().toString();
    const rfidIP = '121.234.211.12';  //example ip address
    const pigCount = '23'; //example pig cnt
    
    agContract.methods.putPigCnt(rfidIP, pigCount, time).send({
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
  },

};

module.exports = caver;