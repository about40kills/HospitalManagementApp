require('dotenv').config();
const Web3 = require('web3');
const { Network, Alchemy } = require("alchemy-sdk") ;

const ALCHEMY_URL = process.env.ALCHEMY_URL;
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;   


const web3 = new Web3.HttpProvider(ALCHEMY_URL)
async function getChainid() {
    const chainid = await web3;
    console.log(chainid);
}

getChainid();