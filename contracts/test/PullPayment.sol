// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

/**
 * @title PullPayment
 * @dev Sample contract that makes use of the _pull payment_ model with a _withdraw()_ function.
 */
contract PullPayment {
    mapping(address => uint256) public addressBalance;

    /**
     * @dev Receives REEF and adds it to the balance of `receiver`.
     */
    function deposit(address receiver) external payable {
        addressBalance[receiver] += msg.value;
    }

    /**
     * @dev Implementation of the _pull payment_ model. It checks that the calling address has a positive balance.
     */
    function withdraw() external {
        uint256 amount = addressBalance[msg.sender];
        require(amount > 0, "PullPayment: No REEF to be claimed");

        addressBalance[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }
}
