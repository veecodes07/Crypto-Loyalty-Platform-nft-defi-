require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY

module.exports = {
  solidity: "0.8.18",
  networks: {
    mumbai : {
      url : "https://polygon-mumbai.luniverse.io/1684162833563696331",
      accounts: [PRIVATE_KEY],
    }
  }
   
};
