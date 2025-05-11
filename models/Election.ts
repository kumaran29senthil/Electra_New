/**
 * Election model representing an election in the Electra Voting System.
 * This would be used with Mongoose in a MongoDB context.
 */
export interface IElection {
  _id?: string;
  title: string;
  description: string;
  type: 'national' | 'state' | 'local' | 'institutional';
  startDate: Date;
  endDate: Date;
  registrationDeadline: Date;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  eligibleRegions: string[]; // Array of region codes
  registeredVoters: number;
  votesRecorded: number;
  blockchainElectionId?: string; // Reference to the blockchain contract
  candidates: ICandidateReference[];
  createdBy: string; // Admin user ID
  createdAt: Date;
  updatedAt: Date;
}

export interface ICandidateReference {
  candidateId: string; // User ID of the candidate
  status: 'pending' | 'approved' | 'rejected';
  blockchainCandidateId?: string;
  voteCount?: number; // Only populated after election ends
}

/**
 * Mongoose schema code for MongoDB:
 * 
 * import mongoose, { Schema, Document } from 'mongoose';
 * 
 * const CandidateReferenceSchema: Schema = new Schema({
 *   candidateId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
 *   status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
 *   blockchainCandidateId: { type: String },
 *   voteCount: { type: Number }
 * });
 * 
 * const ElectionSchema: Schema = new Schema({
 *   title: { type: String, required: true },
 *   description: { type: String, required: true },
 *   type: { type: String, enum: ['national', 'state', 'local', 'institutional'], required: true },
 *   startDate: { type: Date, required: true },
 *   endDate: { type: Date, required: true },
 *   registrationDeadline: { type: Date, required: true },
 *   status: { 
 *     type: String, 
 *     enum: ['upcoming', 'active', 'completed', 'cancelled'], 
 *     default: 'upcoming' 
 *   },
 *   eligibleRegions: [{ type: String }],
 *   registeredVoters: { type: Number, default: 0 },
 *   votesRecorded: { type: Number, default: 0 },
 *   blockchainElectionId: { type: String },
 *   candidates: [CandidateReferenceSchema],
 *   createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
 *   createdAt: { type: Date, default: Date.now },
 *   updatedAt: { type: Date, default: Date.now }
 * }, { timestamps: true });
 * 
 * // Add index for querying active elections
 * ElectionSchema.index({ status: 1, startDate: 1, endDate: 1 });
 * 
 * export default mongoose.model<IElection & Document>('Election', ElectionSchema);
 */