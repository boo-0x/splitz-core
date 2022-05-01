const { expect, assert } = require("chai");
const ReefAbi = require("./ReefABI.json");

describe.only("******************* PaymentSplitterERC20 *******************", () => {
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
        depositAmount = config.func.toReef(2000);

        // PaymentSplitter contract
        const paymentSplitterAddress = config.contracts[hre.network.name].paymentSplitterErc20;
        const PaymentSplitter = await reef.getContractFactory("PaymentSplitterERC20", owner);
        if (!paymentSplitterAddress || paymentSplitterAddress == "") {
            // Deploy
            console.log("\tDeploying PaymentSplitter...");
            paymentSplitter = await PaymentSplitter.deploy(payees, shares);
            await paymentSplitter.deployed();
        } else {
            // Get existing contract
            paymentSplitter = PaymentSplitter.attach(paymentSplitterAddress);
        }
        console.log(`\tPaymentSplitter contact deployed to ${paymentSplitter.address}`);

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

        // MockERC20 contract
        const mockTokenAddress = config.contracts[hre.network.name].mockToken;
        const MockToken = await reef.getContractFactory("MockERC20", owner);
        if (!mockTokenAddress || mockTokenAddress == "") {
            // Deploy
            console.log("\tDeploying MockERC20...");
            mockToken = await MockToken.deploy();
            await mockToken.deployed();
        } else {
            // Get existing contract
            mockToken = MockToken.attach(mockTokenAddress);
        }
        console.log(`\tMockERC20 contact deployed to ${mockToken.address}`);

        // Reef token
        reefToken = new ethers.Contract(
            config.contracts[hre.network.name].reefToken,
            ReefAbi,
            owner
        );
    });

    it("Should get PaymentSplitter data", async () => {
        const payeeShares = await paymentSplitter.getPayees();
        expect(payeeShares[0].payee).to.equal(payees[0]);
        expect(payeeShares[1].payee).to.equal(payees[1]);
        expect(payeeShares[2].payee).to.equal(payees[2]);
        expect(Number(payeeShares[0].share)).to.equal(shares[0]);
        expect(Number(payeeShares[1].share)).to.equal(shares[1]);
        expect(Number(payeeShares[2].share)).to.equal(shares[2]);

        expect(Number(await paymentSplitter.totalShares())).to.equal(10000);
        expect(Number(await paymentSplitter.shares(payees[0]))).to.equal(shares[0]);
        expect(Number(await paymentSplitter.shares(payees[1]))).to.equal(shares[1]);
        expect(Number(await paymentSplitter.shares(payees[2]))).to.equal(shares[2]);
        expect(Number(await paymentSplitter.released(payees[0]))).to.equal(0);
        expect(Number(await paymentSplitter.released(payees[1]))).to.equal(0);
        expect(Number(await paymentSplitter.released(payees[2]))).to.equal(0);
    });

    it("Should split received REEF", async () => {
        // Deposit in PaymentSplitter
        await reefToken.transfer(paymentSplitter.address, depositAmount);

        const expectedOwnerShare = Number(depositAmount) * (shares[0] / 10000);
        const expectedBobShare = Number(depositAmount) * (shares[1] / 10000);
        const expectedCharlieShare = Number(depositAmount) * (shares[2] / 10000);

        expect(Number(await paymentSplitter.available(ownerAddress))).to.equal(expectedOwnerShare);
        expect(Number(await paymentSplitter.available(bobAddress))).to.equal(expectedBobShare);
        expect(Number(await paymentSplitter.available(charlieAddress))).to.equal(
            expectedCharlieShare
        );
    });

    it("Should witdraw available REEF", async () => {
        // Release owner's share
        const iniOwnerBalance = await owner.getBalance();
        const tx1 = await paymentSplitter.connect(bob).release(ownerAddress);
        const eventArgs1 = (await tx1.wait()).events[0].args;
        const endOwnerBalance = await owner.getBalance();

        const expectedOwnerShare = Number(depositAmount) * (shares[0] / 10000);
        expect(Number(endOwnerBalance.sub(iniOwnerBalance))).to.equal(expectedOwnerShare);
        expect(Number(await paymentSplitter.released(ownerAddress))).to.equal(expectedOwnerShare);
        expect(Number(await provider.getBalance(paymentSplitter.address))).to.equal(
            depositAmount - expectedOwnerShare
        );
        expect(eventArgs1.to).to.equal(ownerAddress);
        expect(Number(eventArgs1[1])).to.equal(expectedOwnerShare);

        // Release Bob's share
        const iniBobBalance = await bob.getBalance();
        const tx2 = await paymentSplitter.connect(owner).release(bobAddress);
        const eventArgs2 = (await tx2.wait()).events[0].args;
        const endBobBalance = await bob.getBalance();

        const expectedBobShare = Number(depositAmount) * (shares[1] / 10000);
        expect(Number(endBobBalance.sub(iniBobBalance))).to.equal(expectedBobShare);
        expect(Number(await paymentSplitter.released(bobAddress))).to.equal(expectedBobShare);
        expect(Number(await provider.getBalance(paymentSplitter.address))).to.equal(
            depositAmount - expectedOwnerShare - expectedBobShare
        );
        expect(eventArgs2.to).to.equal(bobAddress);
        expect(Number(eventArgs2[1])).to.equal(expectedBobShare);
    });

    it("Should withdraw REEF from another contract", async () => {
        // Deposit in PullPayment contract
        const depositAmountContract = config.func.toReef(500);
        await pullPayment
            .connect(bob)
            .deposit(paymentSplitter.address, { value: depositAmountContract });

        // Withdraw from PullPayment
        await paymentSplitter.connect(bob).withdrawFromContract(pullPayment.address);

        // Release owner's share
        const iniOwnerBalance = await owner.getBalance();
        await paymentSplitter.connect(bob).release(ownerAddress);
        const endOwnerBalance = await owner.getBalance();

        const expectedOwnerShare = Number(depositAmountContract) * (shares[0] / 10000);
        expect(Number(endOwnerBalance.sub(iniOwnerBalance))).to.equal(expectedOwnerShare);
    });

    it("Should split received ERC20 tokens", async () => {
        // Deposit in PaymentSplitter
        await mockToken.transfer(paymentSplitter.address, depositAmount);

        const expectedOwnerShare = Number(depositAmount) * (shares[0] / 10000);
        const expectedBobShare = Number(depositAmount) * (shares[1] / 10000);
        const expectedCharlieShare = Number(depositAmount) * (shares[2] / 10000);

        expect(
            Number(await paymentSplitter.availableERC20(mockToken.address, ownerAddress))
        ).to.equal(expectedOwnerShare);
        expect(
            Number(await paymentSplitter.availableERC20(mockToken.address, bobAddress))
        ).to.equal(expectedBobShare);
        expect(
            Number(await paymentSplitter.availableERC20(mockToken.address, charlieAddress))
        ).to.equal(expectedCharlieShare);
    });

    it("Should witdraw available ERC20 tokens", async () => {
        // Release owner's share
        const iniOwnerBalance = await mockToken.balanceOf(ownerAddress);
        const tx1 = await paymentSplitter
            .connect(bob)
            .releaseERC20(mockToken.address, ownerAddress);
        const eventArgs1 = (await tx1.wait()).events[1].args;
        const endOwnerBalance = await mockToken.balanceOf(ownerAddress);

        const expectedOwnerShare = Number(depositAmount) * (shares[0] / 10000);
        expect(Number(endOwnerBalance.sub(iniOwnerBalance))).to.equal(expectedOwnerShare);
        expect(
            Number(await paymentSplitter.releasedERC20(mockToken.address, ownerAddress))
        ).to.equal(expectedOwnerShare);
        expect(Number(await mockToken.balanceOf(paymentSplitter.address))).to.equal(
            depositAmount - expectedOwnerShare
        );
        expect(eventArgs1.token).to.equal(mockToken.address);
        expect(eventArgs1.to).to.equal(ownerAddress);
        expect(Number(eventArgs1[2])).to.equal(expectedOwnerShare);

        // Release Bob's share
        const iniBobBalance = await mockToken.balanceOf(bobAddress);
        const tx2 = await paymentSplitter
            .connect(owner)
            .releaseERC20(mockToken.address, bobAddress);
        const eventArgs2 = (await tx2.wait()).events[1].args;
        const endBobBalance = await mockToken.balanceOf(bobAddress);

        const expectedBobShare = Number(depositAmount) * (shares[1] / 10000);
        expect(Number(endBobBalance.sub(iniBobBalance))).to.equal(expectedBobShare);
        expect(Number(await paymentSplitter.releasedERC20(mockToken.address, bobAddress))).to.equal(
            expectedBobShare
        );
        expect(Number(await mockToken.balanceOf(paymentSplitter.address))).to.equal(
            depositAmount - expectedOwnerShare - expectedBobShare
        );
        expect(eventArgs2.token).to.equal(mockToken.address);
        expect(eventArgs2.to).to.equal(bobAddress);
        expect(Number(eventArgs2[2])).to.equal(expectedBobShare);
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
