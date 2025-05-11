/**
 * User model representing a user in the Electra Voting System.
 * This would be used with Mongoose in a MongoDB context.
 */
export interface IUser {
  _id?: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: 'voter' | 'candidate' | 'admin';
  firebaseUid: string;
  idType: 'aadhaar' | 'passport';
  idNumber: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isFaceVerified: boolean;
  digitalVoterId?: string;
  profilePicUrl?: string;
  walletAddress?: string;
  cvatsScore?: number; // Comprehensive Voter Authentication Trust Score
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Mongoose schema code for MongoDB:
 * 
 * import mongoose, { Schema, Document } from 'mongoose';
 * 
 * const UserSchema: Schema = new Schema({
 *   fullName: { type: String, required: true },
 *   email: { type: String, required: true, unique: true },
 *   phoneNumber: { type: String, required: true },
 *   role: { type: String, enum: ['voter', 'candidate', 'admin'], default: 'voter' },
 *   firebaseUid: { type: String, required: true, unique: true },
 *   idType: { type: String, enum: ['aadhaar', 'passport'], required: true },
 *   idNumber: { type: String, required: true },
 *   isEmailVerified: { type: Boolean, default: false },
 *   isPhoneVerified: { type: Boolean, default: false },
 *   isFaceVerified: { type: Boolean, default: false },
 *   digitalVoterId: { type: String, unique: true, sparse: true },
 *   profilePicUrl: { type: String },
 *   walletAddress: { type: String },
 *   cvatsScore: { type: Number, min: 0, max: 1 },
 *   createdAt: { type: Date, default: Date.now },
 *   updatedAt: { type: Date, default: Date.now }
 * }, { timestamps: true });
 * 
 * // Create unique compound index for ID type and number
 * UserSchema.index({ idType: 1, idNumber: 1 }, { unique: true });
 * 
 * export default mongoose.model<IUser & Document>('User', UserSchema);
 */