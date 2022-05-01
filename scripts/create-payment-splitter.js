async function main() {
    // Initial data
    [account1, account1Address] = await config.func.getSignerAndAddress("account1");
    [account2, account2Address] = await config.func.getSignerAndAddress("account2");
    [account3, account3Address] = await config.func.getSignerAndAddress("account3");
    const payees = [await account1Address, await account2Address, await account3Address];
    const shares = [3000, 5000, 2000];

    // Get PaymentSplitterFactory
    const PaymentSplitterFactory = await reef.getContractFactory(
        "PaymentSplitterFactory",
        account1
    );
    const paymentSplitterFactory = PaymentSplitterFactory.attach(
        config.contracts[hre.network.name].paymentSplitterFactory
    );

    // Create PaymentSplitter
    const tx = await paymentSplitterFactory.createPaymentSplitter(payees, shares);
    const paymentSplitterAddress = (await tx.wait()).events[0].args[0];
    console.log(`\tPaymentSplitter instance deployed to ${paymentSplitterAddress}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });
