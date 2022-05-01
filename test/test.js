const { expect, assert } = require("chai");

describe("******************* PaymentSplitterFactory *******************", () => {
    let paymentSplitter;

    before(async () => {
        console.log(`Running network => ${hre.network.name}\n`);

        // Get accounts
        [owner, ownerAddress] = await config.func.getSignerAndAddress(
            hre.network.name == "reef" ? "alice" : "account1"
        );
        [bob, bobAddress] = await config.func.getSignerAndAddress(
            hre.network.name == "reef" ? "bob" : "account2"
        );
        charlie = await reef.getSignerByName(hre.network.name == "reef" ? "charlie" : "account3");
        charlieAddress = await charlie.getAddress();

        // Setup data
        payees = [ownerAddress, bobAddress, charlieAddress];
        shares = [3000, 5000, 2000];
        provider = await reef.getProvider();

        // PaymentSplitter contract
        PaymentSplitter = await reef.getContractFactory("PaymentSplitter", owner);

        // PaymentSplitterFactory contract
        const paymentSplitterFactoryAddress =
            config.contracts[hre.network.name].paymentSplitterFactory;
        const PaymentSplitterFactory = await reef.getContractFactory(
            "PaymentSplitterFactory",
            owner
        );
        if (!paymentSplitterFactoryAddress || paymentSplitterFactoryAddress == "") {
            // Deploy
            console.log("\tDeploying PaymentSplitterFactory...");
            paymentSplitterFactory = await PaymentSplitterFactory.deploy();
            await paymentSplitterFactory.deployed();
        } else {
            // Get existing contract
            paymentSplitterFactory = PaymentSplitterFactory.attach(paymentSplitterFactoryAddress);
        }
        console.log(
            `\tPaymentSplitterFactory contact deployed to ${paymentSplitterFactory.address}`
        );

        // TransferHelper contract
        const transferHelperAddress = config.contracts[hre.network.name].transferHelper;
        const TransferHelper = await reef.getContractFactory("TransferHelper", owner);
        if (!transferHelperAddress || transferHelperAddress == "") {
            // Deploy
            console.log("\tDeploying TransferHelper...");
            transferHelper = await TransferHelper.deploy();
            await transferHelper.deployed();
        } else {
            // Get existing contract
            transferHelper = TransferHelper.attach(transferHelperAddress);
        }
        console.log(`\tTransferHelper contact deployed to ${transferHelper.address}`);

        // PullPayment contract
        const pullPaymentAddress = config.contracts[hre.network.name].pullPayment;
        const PullPayment = await reef.getContractFactory("PullPayment", owner);
        if (!pullPaymentAddress || pullPaymentAddress == "") {
            // Deploy
            console.log("\tDeploying PullPayment...");
            pullPayment = await PullPayment.deploy();
            await pullPayment.deployed();
        } else {
            // Get existing contract
            pullPayment = PullPayment.attach(pullPaymentAddress);
        }
        console.log(`\tPullPayment contact deployed to ${pullPayment.address}`);
    });

    it("Should create new PaymentSplitter contract", async () => {
        // Create PaymentSplitter instance
        const tx = await paymentSplitterFactory.createPaymentSplitter(payees, shares);
        const paymentSplitterAddress = (await tx.wait()).events[0].args[0];
        paymentSplitter = PaymentSplitter.attach(paymentSplitterAddress);

        expect(Number(await paymentSplitter.totalShares())).to.equal(10000);
        expect(Number(await paymentSplitter.totalReleased())).to.equal(0);
        expect(Number(await paymentSplitter.shares(payees[0]))).to.equal(shares[0]);
        expect(Number(await paymentSplitter.shares(payees[1]))).to.equal(shares[1]);
        expect(Number(await paymentSplitter.shares(payees[2]))).to.equal(shares[2]);
        expect(Number(await paymentSplitter.released(payees[0]))).to.equal(0);
        expect(Number(await paymentSplitter.released(payees[1]))).to.equal(0);
        expect(Number(await paymentSplitter.released(payees[2]))).to.equal(0);
    });

    it("Should split amounts received", async () => {
        // Deposit in PaymentSplitter
        const depositAmount = config.func.toReef(2000);
        await transferHelper.to(paymentSplitter.address, { value: depositAmount });

        // Release owner's share
        const iniOwnerBalance = await owner.getBalance();
        await paymentSplitter.connect(bob).release(ownerAddress);
        const endOwnerBalance = await owner.getBalance();

        const expectedOwnerShare = Number(depositAmount) * (shares[0] / 10000);
        expect(Number(endOwnerBalance.sub(iniOwnerBalance))).to.equal(expectedOwnerShare);
        expect(Number(await paymentSplitter.released(ownerAddress))).to.equal(expectedOwnerShare);
        expect(Number(await provider.getBalance(paymentSplitter.address))).to.equal(
            depositAmount - expectedOwnerShare
        );

        // Release Bob's share
        const iniBobBalance = await bob.getBalance();
        await paymentSplitter.connect(owner).release(bobAddress);
        const endBobBalance = await bob.getBalance();

        const expectedBobShare = Number(depositAmount) * (shares[1] / 10000);
        expect(Number(endBobBalance.sub(iniBobBalance))).to.equal(expectedBobShare);
        expect(Number(await paymentSplitter.released(bobAddress))).to.equal(expectedBobShare);
        expect(Number(await provider.getBalance(paymentSplitter.address))).to.equal(
            depositAmount - expectedOwnerShare - expectedBobShare
        );
    });

    it("Should withdraw from another contract", async () => {
        // Deposit in PullPayment contract
        const depositAmount = config.func.toReef(500);
        await pullPayment.connect(bob).deposit(paymentSplitter.address, { value: depositAmount });

        // Withdraw from PullPayment
        await paymentSplitter.connect(bob).withdrawFromContract(pullPayment.address);

        // Release owner's share
        const iniOwnerBalance = await owner.getBalance();
        await paymentSplitter.connect(bob).release(ownerAddress);
        const endOwnerBalance = await owner.getBalance();

        const expectedOwnerShare = Number(depositAmount) * (shares[0] / 10000);
        expect(Number(endOwnerBalance.sub(iniOwnerBalance))).to.equal(expectedOwnerShare);
    });
});

revertedWith = async (promise, message) => {
    try {
        await promise;
        console.log("Promise was expected to throw error but did not.");
        assert(false);
    } catch (error) {
        expect(error.message).contains(message);
    }
};
