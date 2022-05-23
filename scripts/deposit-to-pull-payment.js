const ReefAbi = require("../test/ReefABI.json");

async function main() {
    // Input data
    const depositAmount = config.func.toReef(100);
    const pullPaymentAddress = config.contracts[hre.network.name].pullPayment;
    const splitzAddress = config.contracts[hre.network.name].splitz;

    // Setup
    const owner = await reef.getSignerByName("account1");
    const reefToken = new ethers.Contract(
        config.contracts[hre.network.name].reefToken,
        ReefAbi,
        owner
    );
    const PullPayment = await reef.getContractFactory("PullPayment", owner);
    const pullPayment = PullPayment.attach(pullPaymentAddress);
    const toNumber = config.func.toNumber;

    // Execute
    console.log("Initial balance:", toNumber(await reefToken.balanceOf(pullPaymentAddress)));
    await pullPayment.connect(owner).deposit(splitzAddress, { value: depositAmount });
    console.log("Final balance:", toNumber(await reefToken.balanceOf(pullPaymentAddress)));
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });
