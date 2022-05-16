async function main() {
    // Initial data
    [owner, ownerAddress] = await config.func.getSignerAndAddress(
        hre.network.name == "reef" ? "alice" : "account1"
    );
    [bob, bobAddress] = await config.func.getSignerAndAddress(
        hre.network.name == "reef" ? "bob" : "account2"
    );
    charlie = await reef.getSignerByName(hre.network.name == "reef" ? "charlie" : "account3");
    charlieAddress = await charlie.getAddress();

    const payees = [ownerAddress, bobAddress, charlieAddress];
    const shares = [3000, 5000, 2000];

    // Deploy
    const Splitz = await reef.getContractFactory("Splitz", owner);
    const splitz = await Splitz.deploy(payees, shares);
    await splitz.deployed();
    console.log(`Splitz deployed to ${splitz.address}`);

    // Verify
    await reef.verifyContract(splitz.address, "Splitz", [payees, shares]);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });
