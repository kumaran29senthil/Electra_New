// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./VoterRegistry.sol";

/**
 * @title BallotBox
 * @dev Manages elections and voting processes for the Electra voting system
 */
contract BallotBox {
    // Reference to the VoterRegistry contract
    VoterRegistry public voterRegistry;
    
    // Admin address
    address public admin;
    
    // Election structure
    struct Election {
        string name;
        string description;
        uint256 startTime;
        uint256 endTime;
        bool isActive;
        bool resultsFinalized;
        mapping(uint256 => Candidate) candidates; // CandidateId => Candidate
        uint256 candidateCount;
        mapping(address => bool) hasVoted;
        uint256 totalVotes;
        string eligibleRegions; // JSON string of eligible regions
    }
    
    // Candidate structure
    struct Candidate {
        string name;
        string partyAffiliation;
        string manifestoHash; // IPFS hash of candidate's manifesto
        bool isApproved;
        uint256 voteCount;
    }
    
    // Mapping of election ID to Election
    mapping(uint256 => Election) public elections;
    
    // Total number of elections
    uint256 public electionCount;
    
    // Events
    event ElectionCreated(uint256 indexed electionId, string name, uint256 startTime, uint256 endTime);
    event CandidateAdded(uint256 indexed electionId, uint256 indexed candidateId, string name);
    event CandidateApproved(uint256 indexed electionId, uint256 indexed candidateId);
    event VoteCast(uint256 indexed electionId, address indexed voter);
    event ElectionActivated(uint256 indexed electionId);
    event ElectionDeactivated(uint256 indexed electionId);
    event ResultsFinalized(uint256 indexed electionId);
    
    // Modifiers
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }
    
    modifier onlyVerifiedVoter() {
        require(voterRegistry.isVoterVerified(msg.sender), "Voter is not verified");
        _;
    }
    
    modifier electionExists(uint256 electionId) {
        require(electionId > 0 && electionId <= electionCount, "Election does not exist");
        _;
    }
    
    modifier electionActive(uint256 electionId) {
        require(elections[electionId].isActive, "Election is not active");
        require(block.timestamp >= elections[electionId].startTime, "Election has not started yet");
        require(block.timestamp <= elections[electionId].endTime, "Election has ended");
        _;
    }
    
    /**
     * @dev Constructor sets the admin and VoterRegistry contract address
     * @param _voterRegistryAddress Address of the VoterRegistry contract
     */
    constructor(address _voterRegistryAddress) {
        admin = msg.sender;
        voterRegistry = VoterRegistry(_voterRegistryAddress);
    }
    
    /**
     * @dev Create a new election
     * @param name Name of the election
     * @param description Description of the election
     * @param startTime Start timestamp of the election
     * @param endTime End timestamp of the election
     * @param eligibleRegions JSON string of eligible regions
     * @return electionId ID of the created election
     */
    function createElection(
        string memory name,
        string memory description,
        uint256 startTime,
        uint256 endTime,
        string memory eligibleRegions
    ) external onlyAdmin returns (uint256) {
        require(startTime > block.timestamp, "Start time must be in the future");
        require(endTime > startTime, "End time must be after start time");
        
        electionCount++;
        uint256 electionId = electionCount;
        
        Election storage newElection = elections[electionId];
        newElection.name = name;
        newElection.description = description;
        newElection.startTime = startTime;
        newElection.endTime = endTime;
        newElection.isActive = false; // Elections start inactive until manually activated
        newElection.resultsFinalized = false;
        newElection.candidateCount = 0;
        newElection.totalVotes = 0;
        newElection.eligibleRegions = eligibleRegions;
        
        emit ElectionCreated(electionId, name, startTime, endTime);
        
        return electionId;
    }
    
    /**
     * @dev Add a candidate to an election
     * @param electionId ID of the election
     * @param name Name of the candidate
     * @param partyAffiliation Party affiliation of the candidate
     * @param manifestoHash IPFS hash of the candidate's manifesto
     * @return candidateId ID of the added candidate
     */
    function addCandidate(
        uint256 electionId,
        string memory name,
        string memory partyAffiliation,
        string memory manifestoHash
    ) external onlyAdmin electionExists(electionId) returns (uint256) {
        require(!elections[electionId].resultsFinalized, "Election results are finalized");
        
        Election storage election = elections[electionId];
        election.candidateCount++;
        uint256 candidateId = election.candidateCount;
        
        Candidate storage newCandidate = election.candidates[candidateId];
        newCandidate.name = name;
        newCandidate.partyAffiliation = partyAffiliation;
        newCandidate.manifestoHash = manifestoHash;
        newCandidate.isApproved = false; // Candidates start unapproved until manually approved
        newCandidate.voteCount = 0;
        
        emit CandidateAdded(electionId, candidateId, name);
        
        return candidateId;
    }
    
    /**
     * @dev Approve a candidate for an election
     * @param electionId ID of the election
     * @param candidateId ID of the candidate
     */
    function approveCandidate(uint256 electionId, uint256 candidateId) external onlyAdmin electionExists(electionId) {
        require(candidateId > 0 && candidateId <= elections[electionId].candidateCount, "Candidate does not exist");
        require(!elections[electionId].candidates[candidateId].isApproved, "Candidate already approved");
        
        elections[electionId].candidates[candidateId].isApproved = true;
        
        emit CandidateApproved(electionId, candidateId);
    }
    
    /**
     * @dev Cast a vote in an election
     * @param electionId ID of the election
     * @param candidateId ID of the candidate
     */
    function castVote(uint256 electionId, uint256 candidateId) external onlyVerifiedVoter electionExists(electionId) electionActive(electionId) {
        Election storage election = elections[electionId];
        
        require(!election.hasVoted[msg.sender], "Voter has already voted in this election");
        require(candidateId > 0 && candidateId <= election.candidateCount, "Candidate does not exist");
        require(election.candidates[candidateId].isApproved, "Candidate is not approved");
        
        // Mark voter as having voted
        election.hasVoted[msg.sender] = true;
        
        // Update vote count for the candidate
        election.candidates[candidateId].voteCount++;
        
        // Update total votes
        election.totalVotes++;
        
        // Mark in the VoterRegistry that the voter has voted in this election
        voterRegistry.markVoted(msg.sender, electionId);
        
        emit VoteCast(electionId, msg.sender);
    }
    
    /**
     * @dev Activate an election
     * @param electionId ID of the election
     */
    function activateElection(uint256 electionId) external onlyAdmin electionExists(electionId) {
        require(!elections[electionId].isActive, "Election is already active");
        
        elections[electionId].isActive = true;
        
        emit ElectionActivated(electionId);
    }
    
    /**
     * @dev Deactivate an election
     * @param electionId ID of the election
     */
    function deactivateElection(uint256 electionId) external onlyAdmin electionExists(electionId) {
        require(elections[electionId].isActive, "Election is already inactive");
        
        elections[electionId].isActive = false;
        
        emit ElectionDeactivated(electionId);
    }
    
    /**
     * @dev Finalize the results of an election
     * @param electionId ID of the election
     */
    function finalizeResults(uint256 electionId) external onlyAdmin electionExists(electionId) {
        require(!elections[electionId].resultsFinalized, "Results already finalized");
        require(block.timestamp > elections[electionId].endTime, "Election has not ended yet");
        
        elections[electionId].resultsFinalized = true;
        
        emit ResultsFinalized(electionId);
    }
    
    /**
     * @dev Check if a voter has voted in an election
     * @param electionId ID of the election
     * @param voter Address of the voter
     * @return hasVoted Whether the voter has voted
     */
    function hasVoted(uint256 electionId, address voter) external view electionExists(electionId) returns (bool) {
        return elections[electionId].hasVoted[voter];
    }
    
    /**
     * @dev Get a candidate's information
     * @param electionId ID of the election
     * @param candidateId ID of the candidate
     * @return name Name of the candidate
     * @return partyAffiliation Party affiliation of the candidate
     * @return manifestoHash IPFS hash of the candidate's manifesto
     * @return isApproved Whether the candidate is approved
     * @return voteCount Number of votes received by the candidate
     */
    function getCandidate(uint256 electionId, uint256 candidateId) external view electionExists(electionId) returns (
        string memory name,
        string memory partyAffiliation,
        string memory manifestoHash,
        bool isApproved,
        uint256 voteCount
    ) {
        require(candidateId > 0 && candidateId <= elections[electionId].candidateCount, "Candidate does not exist");
        
        Candidate storage candidate = elections[electionId].candidates[candidateId];
        
        return (
            candidate.name,
            candidate.partyAffiliation,
            candidate.manifestoHash,
            candidate.isApproved,
            // Only return vote count if election is over or results are finalized
            (block.timestamp > elections[electionId].endTime || elections[electionId].resultsFinalized) ? candidate.voteCount : 0
        );
    }
    
    /**
     * @dev Get the number of candidates in an election
     * @param electionId ID of the election
     * @return count Number of candidates
     */
    function getCandidateCount(uint256 electionId) external view electionExists(electionId) returns (uint256) {
        return elections[electionId].candidateCount;
    }
    
    /**
     * @dev Get election details
     * @param electionId ID of the election
     * @return name Name of the election
     * @return description Description of the election
     * @return startTime Start timestamp of the election
     * @return endTime End timestamp of the election
     * @return isActive Whether the election is active
     * @return resultsFinalized Whether the results are finalized
     * @return candidateCount Number of candidates in the election
     * @return totalVotes Total number of votes cast in the election
     */
    function getElectionDetails(uint256 electionId) external view electionExists(electionId) returns (
        string memory name,
        string memory description,
        uint256 startTime,
        uint256 endTime,
        bool isActive,
        bool resultsFinalized,
        uint256 candidateCount,
        uint256 totalVotes
    ) {
        Election storage election = elections[electionId];
        
        return (
            election.name,
            election.description,
            election.startTime,
            election.endTime,
            election.isActive,
            election.resultsFinalized,
            election.candidateCount,
            election.totalVotes
        );
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