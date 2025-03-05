require('dotenv').config();
const { Network, Alchemy } = require("alchemy-sdk") ;


const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;

if (!ALCHEMY_API_KEY) {
    console.error('ALCHEMY_RPC_URL is not defined in the .env file');
    process.exit(1);
}


// Optional config object, but defaults to demo api-key and eth-mainnet.
const settings = {
  apiKey: ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET, 
};
const alchemy = new Alchemy(settings);

alchemy.core.getBlockNumber().then(console.log);


module.exports = alchemy;