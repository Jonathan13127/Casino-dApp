// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";


contract CoinFlip is Ownable {

    function bet(uint _cote) public payable returns (uint){
        require(msg.value == 1 ether);

        require(address(this).balance > 1000 ether, "Insufficient Funds");

        // PILE = 0 | FACE = 1 
        uint256 randomNumber = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender))) % 2;
        console.log("random number =",randomNumber);
        if (randomNumber == _cote) {
            uint256 _toSend = ( address(this).balance - address(this).balance + msg.value ) * 2 ;
            payable(msg.sender).transfer(_toSend); //Gagné TODO: A revoir 
            return 1;
        }
        return 0;
    }

    function addFunds() public payable onlyOwner{

    }

    function withDrawEther() public payable onlyOwner{
        payable(msg.sender).transfer(address(this).balance);
    }

    function getOwner() public view returns (address){
        return owner();
    }

    function getBalance() external view returns (uint){
        return address(this).balance;
    }
}
