/**
 * Vote model representing a vote cast by a user in the Electra Voting System.
 * This would be used with Mongoose in a MongoDB context.
 */
export interface IVote {
  _id?: string;
  electionId: string;
  voterId: string;
  candidateId: string;
  blockchainTransactionHash: string;
  blockchainTimestamp: Date;
  cvatsScore: number; // Comprehensive Voter Authentication Trust Score at time of voting
  ipAddress: string;
  deviceInfo: string;
  voteHash: string; // Hash of the vote details for verification
  createdAt: Date;
}

/**
 * Mongoose schema code for MongoDB:
 * 
 * import mongoose, { Schema, Document } from 'mongoose';
 * 
 * const VoteSchema: Schema = new Schema({
 *   electionId: { type: Schema.Types.ObjectId, ref: 'Election', required: true },
 *   voterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
 *   candidateId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
 *   blockchainTransactionHash: { type: String, required: true, unique: true },
 *   blockchainTimestamp: { type: Date, required: true },
 *   cvatsScore: { type: Number, required: true },
 *   ipAddress: { type: String, required: true },
 *   deviceInfo: { type: String, required: true },
 *   voteHash: { type: String, required: true },
 *   createdAt: { type: Date, default: Date.now }
 * }, { timestamps: { updatedAt: false } }); // Votes should never be updated
 * 
 * // Create unique index to ensure a voter can only vote once in an election
 * VoteSchema.index({ electionId: 1, voterId: 1 }, { unique: true });
 * 
 * export default mongoose.model<IVote & Document>('Vote', VoteSchema);
 */