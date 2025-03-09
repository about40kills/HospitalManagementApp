require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.0",
  networks: { 
    ganache: {
      url: "http://127.0.0.1:8545",
      mnemonic: "just hip guard goose illegal shine poem item insane farm wing damage"
}}
};