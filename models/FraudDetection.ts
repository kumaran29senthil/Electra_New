/**
 * FraudDetection model for tracking potential fraud in the Electra Voting System.
 * This would be used with Mongoose in a MongoDB context.
 */
export interface IFraudDetection {
  _id?: string;
  type: 'single' | 'group'; // Single anomaly or group fraud
  severity: 'low' | 'medium' | 'high';
  description: string;
  electionId: string;
  detectedAt: Date;
  affectedUsers: string[]; // Array of user IDs
  ipAddresses: string[]; // Array of suspicious IP addresses
  deviceFingerprints: string[]; // Array of device fingerprints
  anomalyScore: number; // Score from ML model
  isResolved: boolean;
  resolutionNotes?: string;
  resolvedBy?: string; // Admin user ID
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Mongoose schema code for MongoDB:
 * 
 * import mongoose, { Schema, Document } from 'mongoose';
 * 
 * const FraudDetectionSchema: Schema = new Schema({
 *   type: { type: String, enum: ['single', 'group'], required: true },
 *   severity: { type: String, enum: ['low', 'medium', 'high'], required: true },
 *   description: { type: String, required: true },
 *   electionId: { type: Schema.Types.ObjectId, ref: 'Election', required: true },
 *   detectedAt: { type: Date, default: Date.now },
 *   affectedUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
 *   ipAddresses: [{ type: String }],
 *   deviceFingerprints: [{ type: String }],
 *   anomalyScore: { type: Number, required: true },
 *   isResolved: { type: Boolean, default: false },
 *   resolutionNotes: { type: String },
 *   resolvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
 *   resolvedAt: { type: Date },
 *   createdAt: { type: Date, default: Date.now },
 *   updatedAt: { type: Date, default: Date.now }
 * }, { timestamps: true });
 * 
 * // Add index for querying unresolved high-severity fraud cases
 * FraudDetectionSchema.index({ isResolved: 1, severity: 1, detectedAt: -1 });
 * 
 * export default mongoose.model<IFraudDetection & Document>('FraudDetection', FraudDetectionSchema);
 */