// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "../../@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockERC20 is ERC20 {
    constructor() ERC20("MockToken", "MCK") {
        _mint(msg.sender, 1_000_000_000 * (10**decimals()));
    }
}
