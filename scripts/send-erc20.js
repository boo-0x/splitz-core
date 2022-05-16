async function main() {
    // Input data
    const depositAmount = config.func.toReef(10000);
    const erc20Address = config.contracts[hre.network.name].mockToken;
    const splitzAddress = config.contracts[hre.network.name].splitz;

    // Setup
    const owner = await reef.getSignerByName("account1");
    const MockToken = await reef.getContractFactory("MockERC20", owner);
    const mockToken = MockToken.attach(erc20Address);
    const toNumber = config.func.toNumber;

    // Execute
    console.log("Initial balance:", toNumber(await mockToken.balanceOf(splitzAddress)));
    await mockToken.transfer(splitzAddress, depositAmount);
    console.log("Final balance:", toNumber(await mockToken.balanceOf(splitzAddress)));
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });
