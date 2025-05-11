// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title VoterRegistry
 * @dev Manages voter registration and verification for the Electra voting system
 */
contract VoterRegistry {
    // Admin address that can manage the contract
    address public admin;
    
    // Voter structure
    struct Voter {
        bool isRegistered;
        string voterIdHash; // Hash of the voter's digital ID
        mapping(uint256 => bool) hasVotedInElection; // Track which elections the voter has participated in
        uint256 registrationTimestamp;
        bool isVerified; // Whether the voter has completed all verification steps
    }
    
    // Mapping from address to Voter
    mapping(address => Voter) public voters;
    
    // Total number of registered voters
    uint256 public totalVoters;
    
    // Events
    event VoterRegistered(address indexed voter, string voterIdHash);
    event VoterVerified(address indexed voter);
    event VoterStatusUpdated(address indexed voter, bool isVerified);
    
    // Modifiers
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }
    
    modifier onlyRegistered() {
        require(voters[msg.sender].isRegistered, "Voter is not registered");
        _;
    }
    
    /**
     * @dev Constructor initializes the admin
     */
    constructor() {
        admin = msg.sender;
    }
    
    /**
     * @dev Register a new voter with their digital ID hash
     * @param voterIdHash Hash of the voter's digital ID
     */
    function registerVoter(string memory voterIdHash) external {
        require(!voters[msg.sender].isRegistered, "Voter already registered");
        require(bytes(voterIdHash).length > 0, "Invalid voter ID hash");
        
        Voter storage newVoter = voters[msg.sender];
        newVoter.isRegistered = true;
        newVoter.voterIdHash = voterIdHash;
        newVoter.registrationTimestamp = block.timestamp;
        newVoter.isVerified = false; // Voters start unverified until they complete verification
        
        totalVoters++;
        
        emit VoterRegistered(msg.sender, voterIdHash);
    }
    
    /**
     * @dev Mark a voter as verified after they have completed all verification steps
     * @param voter Address of the voter to verify
     */
    function verifyVoter(address voter) external onlyAdmin {
        require(voters[voter].isRegistered, "Voter is not registered");
        require(!voters[voter].isVerified, "Voter already verified");
        
        voters[voter].isVerified = true;
        
        emit VoterVerified(voter);
    }
    
    /**
     * @dev Update voter verification status
     * @param voter Address of the voter
     * @param isVerified New verification status
     */
    function updateVoterStatus(address voter, bool isVerified) external onlyAdmin {
        require(voters[voter].isRegistered, "Voter is not registered");
        
        voters[voter].isVerified = isVerified;
        
        emit VoterStatusUpdated(voter, isVerified);
    }
    
    /**
     * @dev Mark that a voter has voted in a specific election
     * @param voter Address of the voter
     * @param electionId ID of the election
     */
    function markVoted(address voter, uint256 electionId) external onlyAdmin {
        require(voters[voter].isRegistered, "Voter is not registered");
        require(voters[voter].isVerified, "Voter is not verified");
        require(!voters[voter].hasVotedInElection[electionId], "Voter has already voted in this election");
        
        voters[voter].hasVotedInElection[electionId] = true;
    }
    
    /**
     * @dev Check if a voter has voted in a specific election
     * @param voter Address of the voter
     * @param electionId ID of the election
     * @return hasVoted Whether the voter has voted in the election
     */
    function hasVoted(address voter, uint256 electionId) external view returns (bool) {
        return voters[voter].hasVotedInElection[electionId];
    }
    
    /**
     * @dev Check if a voter is verified
     * @param voter Address of the voter
     * @return isVerified Whether the voter is verified
     */
    function isVoterVerified(address voter) external view returns (bool) {
        return voters[voter].isVerified;
    }
    
    /**
     * @dev Check if a voter is registered
     * @param voter Address of the voter
     * @return isRegistered Whether the voter is registered
     */
    function isVoterRegistered(address voter) external view returns (bool) {
        return voters[voter].isRegistered;
    }
    
    /**
     * @dev Get voter registration timestamp
     * @param voter Address of the voter
     * @return timestamp Registration timestamp
     */
    function getVoterRegistrationTime(address voter) external view returns (uint256) {
        require(voters[voter].isRegistered, "Voter is not registered");
        return voters[voter].registrationTimestamp;
    }
    
    /**
     * @dev Transfer admin rights to a new address
     * @param newAdmin Address of the new admin
     */
    function transferAdmin(address newAdmin) external onlyAdmin {
        require(newAdmin != address(0), "Invalid admin address");
        admin = newAdmin;
    }
}