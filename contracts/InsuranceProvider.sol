// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./LifeCoverInsurance.sol"; 

contract InsuranceProvider {
    address public owner;
    LifeCoverInsurance public lifeCoverInsurance;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    modifier isContract(address _addr) {
        uint32 size;
        assembly {
            size := extcodesize(_addr)
        }
        require(size > 0, "Address must be a contract");
        _;
    }

    constructor(address _oracleAddress, uint256 _minimumCoverageAmount, uint256 _maximumCoverageAmount) {
        owner = msg.sender;
        lifeCoverInsurance = new LifeCoverInsurance(_oracleAddress, _minimumCoverageAmount, _maximumCoverageAmount);
    }

    function purchasePolicy(string memory _insuredName, uint256 _coverageAmount) public payable onlyOwner isContract(msg.sender) {
        lifeCoverInsurance.purchasePolicy{value: msg.value}(_insuredName, _coverageAmount);
    }

    function fileClaim(uint256 _policyIndex, uint256 _deathTimestamp) public onlyOwner {
        lifeCoverInsurance.fileClaim(_policyIndex, _deathTimestamp);
    }

    function automatedWithdrawal(uint256 _amount) public onlyOwner {
        lifeCoverInsurance.automatedWithdrawal(_amount);
    }

    // Additional functions can be added based on your requirements

    function getContractBalance() public view onlyOwner returns (uint256) {
        return address(this).balance;
    }
}
