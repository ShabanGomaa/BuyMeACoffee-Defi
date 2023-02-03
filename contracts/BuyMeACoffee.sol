// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

// goerli -> 0xB9bB1A53865c3a3A4a0104eB47c16a00e43FaD13
// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract BuyMeACoffee {
    event NewMemo(
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );

    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    // List of all memos
    Memo[] memos;

    // The address of Contract deployer
    address payable owner;

    constructor() {
        owner = payable(msg.sender);
    }

    /**
     * @dev buy a coffee for contract owner
     * @param _name the name of coffee owner
     * @param _message a message from coffee buyer
     */
    function buyCoffee(
        string memory _name,
        string memory _message
    ) public payable {
        require(msg.value > 0, "Can't buy a coffee wuth 0 eth");

        memos.push(Memo(msg.sender, block.timestamp, _name, _message));

        emit NewMemo(msg.sender, block.timestamp, _name, _message);
    }

    /**
     * @dev buy a coffee for contract owner
     */
    function withdrawTips() public {
        require(owner.send(address(this).balance));
    }

    /**
     * @dev buy a coffee for contract owner
     */
    function getMemos() public view returns (Memo[] memory) {
        return memos;
    }
}
