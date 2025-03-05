const axios = require('axios');
const { json } = require('body-parser');
require('dotenv').config();

const ALCHEMY_URL = process.env.ALCHEMY_URL;

const getLatestBlock = async () => {
    try{
        const res = await axios.post(
            ALCHEMY_URL, {
                jsonrpc: '2.0',
                method: 'eth_blockNumber',
                params: [],
                id: 1
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
        console.log(`Latest block number: ${res.data.result}`);
    }catch(err){
        console.error(err);
    }
}

getLatestBlock()