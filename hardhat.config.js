require("dotenv").config();
require("@reef-defi/hardhat-reef");
require("@primitivefi/hardhat-dodoc");
require("hardhat-contract-sizer");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
    solidity: {
        compilers: [
            {
                version: "0.8.10",
            },
        ],
    },
    defaultNetwork: "reef",
    networks: {
        reef: {
            url: "ws://127.0.0.1:9944",
            scanUrl: "http://localhost:8000",
        },
        reef_testnet: {
            url: "wss://rpc-testnet.reefscan.com/ws",
            scanUrl: "https://testnet.reefscan.com",
            seeds: {
                account1: process.env.ACCOUNT_1,
                account2: process.env.ACCOUNT_2,
                account3: process.env.ACCOUNT_3,
            },
        },
        reef_mainnet: {
            url: "wss://rpc.reefscan.com/ws",
            scanUrl: "https://reefscan.com",
            seeds: {
                account1: process.env.MAINNET_ACCOUNT,
            },
        },
    },
    contracts: {
        reef: {
            splitz: "",
            pullPayment: "",
            mockToken: "",
            reefToken: "",
        },
        reef_testnet: {
            splitz: "0xC1ee40001Ce6E551a72FC601BEB803819f364E38",
            pullPayment: "0x8425da8A15Dc9F5395dBa0C8C4D2116d80FA3aA9",
            mockToken: "0xaf5F0189542c1fE44fF10D7dc07359e57831179A",
            reefToken: "0x0000000000000000000000000000000001000000",
        },
    },
    contractSizer: {
        except: ["/test"],
    },
    mocha: {
        timeout: 150000,
    },
    optimizer: {
        enabled: true,
        runs: 200,
    },
    func: {
        toReef: function toReef(num) {
            return ethers.utils.parseEther(num.toString());
        },
        toNumber: function toNumber(bigNum) {
            return Number(ethers.utils.formatEther(bigNum));
        },
        getSignerAndAddress: async (name) => {
            const signer = await reef.getSignerByName(name);
            if (!(await signer.isClaimed())) {
                console.log(`\tClaiming default account for ${name}...`);
                await signer.claimDefaultAccount();
            }
            const address = await signer.getAddress();

            return [signer, address];
        },
        logBalance: async (signer, name) => {
            const balance = Number(await signer.getBalance()) / 1e18;
            console.log(`Balance of ${name}: ${balance}`);
        },
    },
};
