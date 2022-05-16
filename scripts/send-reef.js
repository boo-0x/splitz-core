const ReefAbi = require("../test/ReefABI.json");

async function main() {
    // Input data
    const depositAmount = config.func.toReef(100);
    const targetAddress = config.contracts[hre.network.name].splitz;

    // Setup
    const owner = await reef.getSignerByName("account1");
    const reefToken = new ethers.Contract(
        config.contracts[hre.network.name].reefToken,
        ReefAbi,
        owner
    );
    const toNumber = config.func.toNumber;

    // Execute
    console.log("Initial balance:", toNumber(await reefToken.balanceOf(targetAddress)));
    await reefToken.transfer(targetAddress, depositAmount);
    console.log("Final balance:", toNumber(await reefToken.balanceOf(targetAddress)));
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });
