require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan")
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  defaultNetwork: "goerli",
  networks: {
     hardhat: {},
     goerli: {
        url: "https://eth-goerli.alchemyapi.io/v2/V5p1PckEwUqIq5s5rA2zvwRKH0V9Hslr",
        accounts: ["e3f4cd385c1834aba7227db3b6468cf1805a2831463042781c529a1beacf9f25"]
     },
     mumbai: {
        url: "https://polygon-mumbai.g.alchemy.com/v2/psFoMk4wDZVB6dyAJAJsmMC3MDSGnt7J",
        accounts: ["9510b7e193ee806b5b9b351e7a3cc6100ff82cbeddb16c65cc7f07bc33c4d234"]
     }
  },
  etherscan: {
   //  apiKey: "XIZ6C66146CC6QSZYVFAM5WMTH9EHWDWEI"
    // apiKey: "YJ546HGGQFGMEE4B22QNGB58QKZ97G8YSP"
   //  apiKey: "2S8CM6KUUPXGG7JV63UZVVVZTWP6RYJXYE"
    apiKey: "C2J3GI995B9DKK1XVF3P67UDHU72P4Q15D",
  }
};
