async function main() {
    // Initial data
    const owner = await reef.getSignerByName("account1");

    const payees = ["0x0000000000000000000000000000000000000001"];
    const shares = [1];

    // Deploy
    const PaymentSplitter = await reef.getContractFactory("PaymentSplitter", owner);
    const paymentSplitter = await PaymentSplitter.deploy(payees, shares);
    await paymentSplitter.deployed();
    console.log(`PaymentSplitter deployed to ${paymentSplitter.address}`);

    // Verify
    await reef.verifyContract(paymentSplitter.address, "PaymentSplitter", [payees, shares]);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });
