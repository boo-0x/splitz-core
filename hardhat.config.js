require("dotenv").config();
require("@reef-defi/hardhat-reef");
require("@primitivefi/hardhat-dodoc");
require("hardhat-contract-sizer");

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
    const accounts = await reef.getSigners();

    for (const account of accounts) {
        console.log(await account.getAddress());
    }
});

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
            paymentSplitterFactory: "",
            paymentSplitter: "",
            paymentSplitterErc20: "0x290C2392d4222CdA3afa2A85e91ba4d5c423D601",
            pullPayment: "0x3E7d40eB2aD50A127ab99bC674988fC21e8e4311",
            reefToken: "0x0000000000000000000000000000000001000000",
            mockToken: "0xb261b138bfb7845e350b64A0308f01df3c6FDC7c",
        },
        reef_testnet: {
            paymentSplitterFactory: "",
            paymentSplitter: "",
            paymentSplitterErc20: "0x61f5e2531C3f1F87bF2a79C51D8247D54Ea233B1",
            pullPayment: "0x8425da8A15Dc9F5395dBa0C8C4D2116d80FA3aA9",
            reefToken: "0x0000000000000000000000000000000001000000",
            mockToken: "0xcd32473d48204c91994b0A5A32647e538e110fF4",
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
        toReef: function toReef(value) {
            return ethers.utils.parseEther(value.toString());
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
