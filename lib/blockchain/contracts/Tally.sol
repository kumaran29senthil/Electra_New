// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./BallotBox.sol";

/**
 * @title Tally
 * @dev Handles vote tallying and result calculation for the Electra voting system
 */
contract Tally {
    // Reference to the BallotBox contract
    BallotBox public ballotBox;
    
    // Admin address
    address public admin;
    
    // Structure for election results
    struct ElectionResult {
        uint256 electionId;
        bool isFinalized;
        uint256 totalVotes;
        uint256 winningCandidateId;
        uint256[] candidateIds;
        uint256[] voteCounts;
        uint256 timestamp;
    }
    
    // Mapping of election ID to ElectionResult
    mapping(uint256 => ElectionResult) public electionResults;
    
    // Events
    event ResultsCalculated(uint256 indexed electionId, uint256 winningCandidateId, uint256 totalVotes);
    event ResultsPublished(uint256 indexed electionId, string resultsHash);
    
    // Modifiers
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }
    
    /**
     * @dev Constructor sets the admin and BallotBox contract address
     * @param _ballotBoxAddress Address of the BallotBox contract
     */
    constructor(address _ballotBoxAddress) {
        admin = msg.sender;
        ballotBox = BallotBox(_ballotBoxAddress);
    }
    
    /**
     * @dev Calculate and store the results for an election
     * @param electionId ID of the election
     */
    function calculateResults(uint256 electionId) external onlyAdmin {
        // Get election details from BallotBox
        (
            ,
            ,
            ,
            uint256 endTime,
            ,
            bool resultsFinalized,
            uint256 candidateCount,
            uint256 totalVotes
        ) = ballotBox.getElectionDetails(electionId);
        
        // Ensure election has ended and results are finalized
        require(block.timestamp > endTime, "Election has not ended yet");
        require(resultsFinalized, "Election results are not finalized in BallotBox");
        
        // Initialize the election result
        ElectionResult storage result = electionResults[electionId];
        result.electionId = electionId;
        result.isFinalized = true;
        result.totalVotes = totalVotes;
        result.timestamp = block.timestamp;
        
        // Initialize arrays for candidate IDs and vote counts
        result.candidateIds = new uint256[](candidateCount);
        result.voteCounts = new uint256[](candidateCount);
        
        // Find the winning candidate
        uint256 winningVoteCount = 0;
        uint256 winningCandidateId = 0;
        
        for (uint256 i = 1; i <= candidateCount; i++) {
            // Get candidate details
            (
                ,
                ,
                ,
                bool isApproved,
                uint256 voteCount
            ) = ballotBox.getCandidate(electionId, i);
            
            // Only count approved candidates
            if (isApproved) {
                result.candidateIds[i-1] = i;
                result.voteCounts[i-1] = voteCount;
                
                // Check if this candidate has more votes than the current winner
                if (voteCount > winningVoteCount) {
                    winningVoteCount = voteCount;
                    winningCandidateId = i;
                }
            }
        }
        
        result.winningCandidateId = winningCandidateId;
        
        emit ResultsCalculated(electionId, winningCandidateId, totalVotes);
    }
    
    /**
     * @dev Publish the results to an external storage system (e.g., IPFS)
     * @param electionId ID of the election
     * @param resultsHash Hash of the detailed results stored externally
     */
    function publishResults(uint256 electionId, string memory resultsHash) external onlyAdmin {
        require(electionResults[electionId].isFinalized, "Election results are not calculated yet");
        require(bytes(resultsHash).length > 0, "Results hash cannot be empty");
        
        emit ResultsPublished(electionId, resultsHash);
    }
    
    /**
     * @dev Get the results for an election
     * @param electionId ID of the election
     * @return isFinalized Whether the results are finalized
     * @return totalVotes Total number of votes cast
     * @return winningCandidateId ID of the winning candidate
     * @return candidateIds Array of candidate IDs
     * @return voteCounts Array of vote counts for each candidate
     */
    function getResults(uint256 electionId) external view returns (
        bool isFinalized,
        uint256 totalVotes,
        uint256 winningCandidateId,
        uint256[] memory candidateIds,
        uint256[] memory voteCounts
    ) {
        ElectionResult storage result = electionResults[electionId];
        require(result.isFinalized, "Election results are not calculated yet");
        
        return (
            result.isFinalized,
            result.totalVotes,
            result.winningCandidateId,
            result.candidateIds,
            result.voteCounts
        );
    }
    
    /**
     * @dev Get the winning candidate for an election
     * @param electionId ID of the election
     * @return candidateId ID of the winning candidate
     * @return voteCount Number of votes received by the winning candidate
     */
    function getWinner(uint256 electionId) external view returns (
        uint256 candidateId,
        uint256 voteCount
    ) {
        ElectionResult storage result = electionResults[electionId];
        require(result.isFinalized, "Election results are not calculated yet");
        
        candidateId = result.winningCandidateId;
        
        // Find the vote count for the winning candidate
        for (uint256 i = 0; i < result.candidateIds.length; i++) {
            if (result.candidateIds[i] == candidateId) {
                voteCount = result.voteCounts[i];
                break;
            }
        }
        
        return (candidateId, voteCount);
    }
    
    /**
     * @dev Transfer admin rights to a new address
     * @param newAdmin Address of the new admin
     */
    function transferAdmin(address newAdmin) external onlyAdmin {
        require(newAdmin != address(0), "Invalid admin address");
        admin = newAdmin;
    }
    
    /**
     * @dev Update the BallotBox contract address
     * @param _ballotBoxAddress Address of the new BallotBox contract
     */
    function updateBallotBoxAddress(address _ballotBoxAddress) external onlyAdmin {
        require(_ballotBoxAddress != address(0), "Invalid BallotBox address");
        ballotBox = BallotBox(_ballotBoxAddress);
    }
}