// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MockMonadToken is ERC20, Ownable {
    constructor() ERC20("Mock Monad Token", "MONAD") Ownable(msg.sender) {
        _mint(msg.sender, 1000000 * 10**18); // Mint 1M tokens to deployer
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function faucet() external {
        _mint(msg.sender, 100 * 10**18); // Give 100 tokens to anyone for testing
    }
}