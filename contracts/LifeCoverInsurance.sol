// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./AggregatorV3Interface.sol";

contract LifeCoverInsurance {

    // Fixed payout rate (90%)
    uint256 public constant FIXED_PAYOUT_RATE = 90;//0.9; 

    // Fixed premium rate (1%)
    uint256 public constant FIXED_PREMIUM_RATE = 1;//0.01; 

    address public oracleAddress;
    uint256 public minimumCoverageAmount;
    uint256 public maximumCoverageAmount;

    struct Policy {
        uint256 coverageAmount;
        bool isClaimed;
        uint256 deathTimestamp;
    }

    mapping(address => Policy[]) public policyholderPolicies;

    constructor(address _oracleAddress, uint256 _minimumCoverageAmount, uint256 _maximumCoverageAmount) {
        oracleAddress = _oracleAddress;
        minimumCoverageAmount = _minimumCoverageAmount;
        maximumCoverageAmount = _maximumCoverageAmount;
    }

    // Calculate the premium amount for a policy
    function premiumForPolicy(string memory _insuredName, uint256 _coverageAmount) public view returns (uint256) {
        // Basic example: Fixed premium rate multiplied by coverage amount
        uint256 premiumAmount = (_coverageAmount * FIXED_PREMIUM_RATE) / 100;
        return premiumAmount;
    }

// Check if an insured person is alive using the oracle or policy data
    function checkInsuredStatus(string memory _insuredName) public view returns (bool) {
        // Get the policies associated with the insured person
        Policy[] storage policies = policyholderPolicies[msg.sender];

        // Iterate through the policies and check if any have a death timestamp
        for (uint256 i = 0; i < policies.length; i++) {
            if (policies[i].deathTimestamp != 0) {
                return false; // Insured person is considered deceased
            }
        }

        return true; // Insured person is considered alive
    }



    // Calculate the payout amount for a deceased insured person
    function payoutForPolicy(string memory _insuredName, uint256 _coverageAmount) public view returns (uint256) {
        // Check if the insured person is deceased
        require(!checkInsuredStatus(_insuredName), "Insured person is not deceased");

        // Basic example: Fixed payout rate multiplied by coverage amount
        uint256 payoutAmount = (_coverageAmount * FIXED_PAYOUT_RATE) / 100;
        
        // Additional logic based on the time of death or other factors can be added here

        return payoutAmount;
    }

    function purchasePolicy(string memory _insuredName, uint256 _coverageAmount) public payable {
        require(_coverageAmount >= minimumCoverageAmount, "Coverage amount must be greater than or equal to the minimum coverage amount");
        require(_coverageAmount <= maximumCoverageAmount, "Coverage amount must be less than or equal to the maximum coverage amount");

        uint256 premiumAmount = premiumForPolicy(_insuredName, _coverageAmount);
        require(msg.value >= premiumAmount, "Insufficient premium amount");

        // Create a new policy for the policyholder
        Policy memory newPolicy = Policy({
            coverageAmount: _coverageAmount,
            isClaimed: false,
            deathTimestamp: 0
        });

        // Store the policy under the policyholder's address
        policyholderPolicies[msg.sender].push(newPolicy);

        // Deposit premium into the issuer's address
        payable(address(this)).transfer(msg.value);

        emit PolicyPurchased(_insuredName, msg.sender, _coverageAmount, premiumAmount);
    }

    function fileClaim(uint256 _policyIndex, uint256 _deathTimestamp) public {
        require(_policyIndex < policyholderPolicies[msg.sender].length, "Invalid policy index");

        Policy storage policy = policyholderPolicies[msg.sender][_policyIndex];

        require(!policy.isClaimed, "Policy has already been claimed");
        require(policy.deathTimestamp == 0, "Policyholder is not deceased");

        policy.deathTimestamp = _deathTimestamp;

        uint256 payoutAmount = payoutForPolicy('policy.address', policy.coverageAmount);

        // Mark the policy as claimed
        policy.isClaimed = true;

        // Automated withdrawal to policyholder's account
        payable(msg.sender).transfer(payoutAmount);

        emit ClaimFiled(msg.sender, _policyIndex, payoutAmount);
    }

    function automatedWithdrawal(uint256 _amount) public {
        // Automated withdrawal from policyholder's account
        // Consider adding additional security checks and limits
        require(_amount > 0, "Invalid withdrawal amount");
        require(address(this).balance >= _amount, "Insufficient contract balance");

        payable(msg.sender).transfer(_amount);
    }

    event PolicyPurchased(string indexed insuredName, address indexed policyHolder, uint256 coverageAmount, uint256 premiumAmount);
    event ClaimFiled(address indexed policyHolder, uint256 indexed policyIndex, uint256 payoutAmount);
}
