async function main() {
    // Initial data
    const owner = await reef.getSignerByName("account1");
    const name = "Dummy Token";
    const ticker = "DMY";

    // Deploy
    const MockERC20 = await reef.getContractFactory("MockERC20", owner);
    const mockERC20 = await MockERC20.deploy(name, ticker);
    await mockERC20.deployed();
    console.log(`MockERC20 deployed to ${mockERC20.address}`);

    // Verify
    await reef.verifyContract(mockERC20.address, "MockERC20ERC20", [name, ticker]);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });
