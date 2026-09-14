require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const accounts = process.env.DEPLOYER_PRIVATE_KEY
  ? [process.env.DEPLOYER_PRIVATE_KEY]
  : [];

module.exports = {
  solidity: {
    version: "0.8.24",
    settings: { optimizer: { enabled: true, runs: 200 } },
  },
  networks: {
    xlayerTestnet: {
      url: process.env.XLAYER_TESTNET_RPC_URL || "https://testrpc.xlayer.tech/terigon",
      chainId: 1952,
      accounts,
    },
    xlayerMainnet: {
      url: process.env.XLAYER_MAINNET_RPC_URL || "https://rpc.xlayer.tech",
      chainId: 196,
      accounts,
    },
  },
  etherscan: {
    apiKey: { xlayerTestnet: "unused", xlayerMainnet: "unused" },
    customChains: [
      { network: "xlayerTestnet", chainId: 1952, urls: { apiURL: "https://www.okx.com/api/v5/explorer/contract/verify-source-code-plugin/XLAYER_TESTNET", browserURL: "https://www.okx.com/web3/explorer/xlayer-test" } },
      { network: "xlayerMainnet", chainId: 196, urls: { apiURL: "https://www.okx.com/api/v5/explorer/contract/verify-source-code-plugin/XLAYER", browserURL: "https://www.okx.com/web3/explorer/xlayer" } },
    ],
  },
};
