// truffle.js config for klaytn.
const PrivateKeyConnector = require('connect-privkey-to-provider')
const NETWORK_ID = '1001'
const GASLIMIT = '20000000'
const URL = 'https://api.baobab.klaytn.net:8651'
const PRIVATE_KEY = '0x3afa7288e637465701fe35291ee2a8ae9a33eb3d29a7d47fd7595c1a1172a6df'

module.exports = {
    networks: {
        klaytn : {
            provider : new PrivateKeyConnector(PRIVATE_KEY, URL),
            network_id : NETWORK_ID,
            gas : GASLIMIT,
            gasPrice : null,
        }
    }
}
