// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "../../@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockERC20 is ERC20 {
    constructor(string memory name, string memory ticker) ERC20(name, ticker) {
        _mint(msg.sender, 1_000_000_000 * (10**decimals()));
    }
}
