//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * A smart contract that allows changing a state variable of the contract and tracking the changes
 * It also allows the owner to withdraw the Ether in the contract
 * @title AgoraDaoFabric
 * @author NightmareFox12
 */
contract AgoraDaoFabric is Ownable {
    struct Dao {
        uint256 daoID;
        address creator;
        string name;
        string description;
        uint256 categoryID;
        string imageURI;
        bool isPublic;
        uint256 creationTimestamp;
    }

    // State Variables
    uint256 public daoCounter;
    uint256 public userCounter;
    string[] internal daoCategories;

    mapping(address => Dao) public daos;

    //events
    event DaoCreated(uint256 indexed daoID, address indexed creator, string indexed name, uint256 creationTimestamp);

    constructor(address initialOwner) Ownable(initialOwner) {
        daoCategories.push("SERVICE");
        daoCategories.push("GOVERNANCE");
    }

    // --- write functions ---
    function createDao(
        string memory _name,
        string memory _description,
        uint256 _categoryID,
        string memory _imageURI,
        bool _isPublic
    ) external {
        //validations
        require(bytes(_name).length > 0, "Dao name must not be empty.");
        require(bytes(_description).length > 0, "Dao description must not be empty.");
        require(_categoryID < daoCategories.length, "Invalid category ID.");
        require(bytes(_imageURI).length > 0, "Image URI must not be empty.");

        //TODO: me falta verificar que el nombre no exista
        
        //create dao
        Dao memory newDao = Dao(
            daoCounter,
            msg.sender,
            _name,
            _description,
            _categoryID,
            _imageURI,
            _isPublic,
            block.timestamp
        );

        daos[msg.sender] = newDao;

        emit DaoCreated(daoCounter, msg.sender, _name, block.timestamp);

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
