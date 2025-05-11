/**
 * Web3 utility functions for interacting with Ethereum blockchain contracts
 * Used for the Electra Voting System
 */
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import VoterRegistryAbi from './abi/VoterRegistry.json';
import BallotBoxAbi from './abi/BallotBox.json';
import TallyAbi from './abi/Tally.json';
import { IUser } from '@/models/User';

// Contract addresses - would be populated from environment variables in production
const VOTER_REGISTRY_ADDRESS = process.env.NEXT_PUBLIC_VOTER_REGISTRY_ADDRESS || '';
const BALLOT_BOX_ADDRESS = process.env.NEXT_PUBLIC_BALLOT_BOX_ADDRESS || '';
const TALLY_ADDRESS = process.env.NEXT_PUBLIC_TALLY_ADDRESS || '';

// Initialize Web3
const getWeb3 = async () => {
  if (typeof window !== 'undefined' && (window as any).ethereum) {
    // Modern browser with MetaMask
    const web3 = new Web3((window as any).ethereum);
    try {
      // Request account access
      await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
      return web3;
    } catch (error) {
      throw new Error('User denied account access');
    }
  } else if (typeof window !== 'undefined' && (window as any).web3) {
    // Legacy dapp browsers
    return new Web3((window as any).web3.currentProvider);
  } else {
    // Fallback to a local provider (for testing)
    const provider = new Web3.providers.HttpProvider('http://localhost:8545');
    return new Web3(provider);
  }
};

// Contract instances
export const getVoterRegistryContract = async () => {
  const web3 = await getWeb3();
  return new web3.eth.Contract(
    VoterRegistryAbi as AbiItem[],
    VOTER_REGISTRY_ADDRESS
  );
};

export const getBallotBoxContract = async () => {
  const web3 = await getWeb3();
  return new web3.eth.Contract(
    BallotBoxAbi as AbiItem[],
    BALLOT_BOX_ADDRESS
  );
};

export const getTallyContract = async () => {
  const web3 = await getWeb3();
  return new web3.eth.Contract(
    TallyAbi as AbiItem[],
    TALLY_ADDRESS
  );
};

// User registration functions
export const registerVoterOnBlockchain = async (user: IUser) => {
  try {
    const web3 = await getWeb3();
    const accounts = await web3.eth.getAccounts();
    const voterRegistryContract = await getVoterRegistryContract();
    
    // Create a hash of the user's digital ID
    const voterIdHash = web3.utils.sha3(
      `${user.idType}:${user.idNumber}:${user.email}:${user.phoneNumber}`
    ) || '';
    
    // Register on blockchain
    const result = await voterRegistryContract.methods
      .registerVoter(voterIdHash)
      .send({ from: accounts[0] });
      
    return {
      success: true,
      transactionHash: result.transactionHash,
      voterIdHash
    };
  } catch (error) {
    console.error('Error registering voter on blockchain:', error);
    return {
      success: false,
      error: (error as Error).message
    };
  }
};

// Voting functions
export const castVoteOnBlockchain = async (
  electionId: number, 
  candidateId: number, 
  userAddress: string
) => {
  try {
    const web3 = await getWeb3();
    const accounts = await web3.eth.getAccounts();
    const ballotBoxContract = await getBallotBoxContract();
    
    // Cast vote on blockchain
    const result = await ballotBoxContract.methods
      .castVote(electionId, candidateId)
      .send({ from: userAddress || accounts[0] });
      
    return {
      success: true,
      transactionHash: result.transactionHash
    };
  } catch (error) {
    console.error('Error casting vote on blockchain:', error);
    return {
      success: false,
      error: (error as Error).message
    };
  }
};

// Election result functions
export const getElectionResults = async (electionId: number) => {
  try {
    const tallyContract = await getTallyContract();
    
    // Get results from blockchain
    const results = await tallyContract.methods
      .getResults(electionId)
      .call();
      
    return {
      success: true,
      isFinalized: results.isFinalized,
      totalVotes: parseInt(results.totalVotes),
      winningCandidateId: parseInt(results.winningCandidateId),
      candidateIds: results.candidateIds.map(Number),
      voteCounts: results.voteCounts.map(Number)
    };
  } catch (error) {
    console.error('Error fetching election results from blockchain:', error);
    return {
      success: false,
      error: (error as Error).message
    };
  }
};

// Election creation and management (admin functions)
export const createElectionOnBlockchain = async (
  name: string,
  description: string,
  startTime: number,
  endTime: number,
  eligibleRegions: string[]
) => {
  try {
    const web3 = await getWeb3();
    const accounts = await web3.eth.getAccounts();
    const ballotBoxContract = await getBallotBoxContract();
    
    // Convert regions array to JSON string
    const regionsJson = JSON.stringify(eligibleRegions);
    
    // Create election on blockchain
    const result = await ballotBoxContract.methods
      .createElection(name, description, startTime, endTime, regionsJson)
      .send({ from: accounts[0] });
      
    // Parse the election ID from the result
    const electionId = parseInt(result.events.ElectionCreated.returnValues.electionId);
      
    return {
      success: true,
      transactionHash: result.transactionHash,
      electionId
    };
  } catch (error) {
    console.error('Error creating election on blockchain:', error);
    return {
      success: false,
      error: (error as Error).message
    };
  }
};

// Check if a voter has already voted in an election
export const hasVotedInElection = async (electionId: number, voterAddress: string) => {
  try {
    const ballotBoxContract = await getBallotBoxContract();
    
    const hasVoted = await ballotBoxContract.methods
      .hasVoted(electionId, voterAddress)
      .call();
      
    return {
      success: true,
      hasVoted
    };
  } catch (error) {
    console.error('Error checking if voter has voted:', error);
    return {
      success: false,
      error: (error as Error).message
    };
  }
};

export default {
  getWeb3,
  getVoterRegistryContract,
  getBallotBoxContract,
  getTallyContract,
  registerVoterOnBlockchain,
  castVoteOnBlockchain,
  getElectionResults,
  createElectionOnBlockchain,
  hasVotedInElection
};