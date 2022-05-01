//SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "./PaymentSplitter.sol";
import "./PaymentSplitterERC20.sol";

/**
 * @title PaymentSplitterFactory
 * @dev Factory for creating new _PaymentSplitter_ contracts.
 *
 */
contract PaymentSplitterFactory {
    event PaymentSplitterCreated(address addr);

    /**
     * @dev Creates an instance of _PaymentSplitter_ where each account in `payees` is assigned the number of shares at
     * the matching position in the `shares` array.
     * Emits a {PaymentSplitterCreated} with the address of the new instance.
     */
    function createPaymentSplitter(address[] calldata payees, uint256[] calldata shares) external {
        PaymentSplitter paymentSplitter = new PaymentSplitter(payees, shares);
        emit PaymentSplitterCreated(address(paymentSplitter));
    }

    function createPaymentSplitterERC20(address[] calldata payees, uint256[] calldata shares)
        external
    {
        PaymentSplitterERC20 paymentSplitter = new PaymentSplitterERC20(payees, shares);
        emit PaymentSplitterCreated(address(paymentSplitter));
    }
}
