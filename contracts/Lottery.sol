// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";


contract Lottery is Ownable {
    address[] public players;
    mapping (address => uint) balances;

    mapping (address => uint) betsOnNumber;
    uint256 public randomIndex;

    function enter() public payable {
        require(msg.value == 0.0001 ether);
        players.push(msg.sender);
    }

    function pickWinner() public onlyOwner returns (address) {

        uint256 arrayLength = players.length;
        require(arrayLength > 0, "There is no player");

        uint256 randomNumber = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, randomIndex))) % arrayLength;
        randomIndex++;

        address pickedWinner = players[randomNumber];

        payable(pickedWinner).transfer(address(this).balance);

        players[randomNumber] = players[arrayLength - 1];
        delete players;
        return pickedWinner;
    }

    function checkIfPlayerPlayed(address _player) public view returns (bool){
        for (uint i = 0; i < players.length; i++) {
            if (players[i] == _player) {
                return true;
            }
        }
        return false;
    }

    function getPlayers() public view returns (address[] memory){
        return players;
    }

    function getBalance() external view returns (uint){
        return address(this).balance;
    }

    function getOwner() public view returns (address){
        return owner();
    }

    function betOnNumber() public payable {
        require(msg.value == 0.01 ether);
        betsOnNumber[msg.sender] = msg.value;
    }
}