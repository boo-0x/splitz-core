async function main() {
    // Initial data
    const owner = await reef.getSignerByName("account1");

    // Deploy
    const PaymentSplitterFactory = await reef.getContractFactory("PaymentSplitterFactory", owner);
    const paymentSplitterFactory = await PaymentSplitterFactory.deploy();
    await paymentSplitterFactory.deployed();
    console.log(`PaymentSplitterFactory deployed to ${paymentSplitterFactory.address}`);

    // Verify
    await reef.verifyContract(paymentSplitterFactory.address, "PaymentSplitterFactory", []);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });
