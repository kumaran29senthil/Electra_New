/**
 * Candidate model representing a candidate application in the Electra Voting System.
 * This would be used with Mongoose in a MongoDB context.
 */
export interface ICandidate {
  _id?: string;
  userId: string; // Reference to the User model
  electionId: string; // Reference to the Election model
  partyAffiliation: string;
  manifestoUrl: string; // URL to the uploaded manifesto PDF
  governmentIdUrl: string; // URL to the uploaded government ID
  constituency: string;
  ageProofUrl: string; // Proof that candidate is ≥ 25 years old
  profilePicUrl: string;
  applicationDate: Date;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  blockchainCandidateId?: string; // ID in the blockchain contract
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Mongoose schema code for MongoDB:
 * 
 * import mongoose, { Schema, Document } from 'mongoose';
 * 
 * const CandidateSchema: Schema = new Schema({
 *   userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
 *   electionId: { type: Schema.Types.ObjectId, ref: 'Election', required: true },
 *   partyAffiliation: { type: String, required: true },
 *   manifestoUrl: { type: String, required: true },
 *   governmentIdUrl: { type: String, required: true },
 *   constituency: { type: String, required: true },
 *   ageProofUrl: { type: String, required: true },
 *   profilePicUrl: { type: String, required: true },
 *   applicationDate: { type: Date, default: Date.now },
 *   status: { 
 *     type: String, 
 *     enum: ['pending', 'approved', 'rejected'], 
 *     default: 'pending' 
 *   },
 *   rejectionReason: { type: String },
 *   blockchainCandidateId: { type: String },
 *   createdAt: { type: Date, default: Date.now },
 *   updatedAt: { type: Date, default: Date.now }
 * }, { timestamps: true });
 * 
 * // Create unique index to ensure a user can only apply once per election
 * CandidateSchema.index({ userId: 1, electionId: 1 }, { unique: true });
 * 
 * export default mongoose.model<ICandidate & Document>('Candidate', CandidateSchema);
 */