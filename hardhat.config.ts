import {config as dotEnvConfig} from "dotenv";
import {HardhatUserConfig} from "hardhat/types";

import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "@nomiclabs/hardhat-etherscan";
import "solidity-coverage";

import "hardhat-gas-reporter"

dotEnvConfig();

const INFURA_API_KEY = process.env.INFURA_API_KEY || "";
const RINKEBY_PRIVATE_KEY = process.env.RINKEBY_PRIVATE_KEY || "";

const config: HardhatUserConfig = {
    defaultNetwork: "hardhat",
    solidity: {
        compilers: [
            {
                version: "0.8.0",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 1000
                    }
                }
            }
        ],
    },
    networks: {
        hardhat: {},
        rinkeby: {
            url: `https://rinkeby.infura.io/v3/${INFURA_API_KEY}`,
            accounts: [RINKEBY_PRIVATE_KEY],
        },
    },
    gasReporter: {
        currency: 'USD',
        enabled: true,
        coinmarketcap: process.env.COIN_MARKET_CAP

    }
};

export default config;