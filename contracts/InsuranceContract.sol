// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract InsuranceContract {
    address public owner;
    
    enum PolicyStatus { Inactive, Active, Claimed, Expired }
    
    struct Policy {
        address policyHolder;
        uint256 premiumAmount;
        uint256 coverageAmount;
        uint256 startDate;
        uint256 endDate;
        PolicyStatus status;
    }
    
    mapping(uint256 => Policy) public policies;
    uint256 public policyCounter;
    
    event PolicyCreated(uint256 policyId, address policyHolder);
    event PolicyActivated(uint256 policyId);
    event PolicyClaimed(uint256 policyId);
    event PolicyExpired(uint256 policyId);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the contract owner");
        _;
    }

    modifier onlyPolicyHolder(uint256 policyId) {
        require(msg.sender == policies[policyId].policyHolder, "Not the policy holder");
        _;
    }

    modifier onlyActivePolicy(uint256 policyId) {
        require(policies[policyId].status == PolicyStatus.Active, "Policy is not active");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function createPolicy(
        uint256 premiumAmount,
        uint256 coverageAmount,
        uint256 durationDays
    ) external {
        require(durationDays > 0, "Duration must be greater than zero");

        uint256 startDate = block.timestamp;
        uint256 endDate = startDate + (durationDays * 1 days);

        policyCounter++;
        policies[policyCounter] = Policy({
            policyHolder: msg.sender,
            premiumAmount: premiumAmount,
            coverageAmount: coverageAmount,
            startDate: startDate,
            endDate: endDate,
            status: PolicyStatus.Inactive
        });

        emit PolicyCreated(policyCounter, msg.sender);
    }

    function activatePolicy(uint256 policyId) external onlyOwner {
        Policy storage policy = policies[policyId];
        require(policy.status == PolicyStatus.Inactive, "Policy is not inactive");
        require(block.timestamp >= policy.startDate, "Policy has not started yet");

        policy.status = PolicyStatus.Active;

        emit PolicyActivated(policyId);
    }

    function claimPolicy(uint256 policyId) external onlyPolicyHolder(policyId) onlyActivePolicy(policyId) {
        Policy storage policy = policies[policyId];
        require(block.timestamp <= policy.endDate, "Policy has expired");

        policy.status = PolicyStatus.Claimed;

        emit PolicyClaimed(policyId);
    }

    function expirePolicy(uint256 policyId) external onlyOwner {
        Policy storage policy = policies[policyId];
        require(policy.status == PolicyStatus.Active, "Policy is not active");
        require(block.timestamp > policy.endDate, "Policy has not expired yet");

        policy.status = PolicyStatus.Expired;

        emit PolicyExpired(policyId);
    }
}
