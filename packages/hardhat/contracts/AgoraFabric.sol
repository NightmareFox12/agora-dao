//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * A smart contract that allows changing a state variable of the contract and tracking the changes
 * It also allows the owner to withdraw the Ether in the contract
 * @author NightmareFox12
 */
contract AgoraFabric is Ownable {
    // State Variables
    uint256 public daoCounter;

    string[] internal daoCategories;

    //events

    constructor(address initialOwner) Ownable(initialOwner) {
        daoCategories.push("SERVICE");
        daoCategories.push("GOVERNANCE");
    }

    // --- write functions ---
    function createDao(string memory _name, string memory _description, bool _isPublic) external {
        daoCounter++;
    }

    function addDaoCategory(string memory newCategory) external onlyOwner {
        require(bytes(newCategory).length > 0, "Category name must not be empty.");

        // Check for duplicates
        for (uint i = 0; i < daoCategories.length; i++) {
            if (keccak256(bytes(daoCategories[i])) == keccak256(bytes(newCategory))) {
                revert("Category already exists. Duplicate entries are not allowed.");
            }
        }

        daoCategories.push(newCategory);
    }

    // --- read functions ---
    function getAllDaoCategories() external view returns (string[] memory) {
        return daoCategories;
    }

    receive() external payable {}
}
