require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.0",
  networks: { 
    ganache: {
      url: "http://127.0.0.1:8545",
      mnemonic: "gesture awake million century busy silver pelican govern casino cable horror bar"
}}
};