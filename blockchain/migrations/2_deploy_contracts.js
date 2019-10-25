const fs = require('fs')
const DontWorry = artifacts.require('./DontWorry.sol')

module.exports = function (deployer) {
  deployer.deploy(DontWorry)
    .then(() => {
      if(DontWorry._json){
        fs.writeFile('deployedABI', JSON.stringify(DontWorry._json.abi),
          (err) => {
            if(err) throw err;
            console.log("파일 ABI 입력 성공");
          }
        )

        fs.writeFile('deployedAddress', DontWorry.address,
          (err) => {
            if(err) throw err;
            console.log("파일에 주소 입력 성공");
          }
        )
      }
    })
}
