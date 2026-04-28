import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  userId: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'active' | 'inactive';
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  userId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, default: 'User' },
  department: { type: String, default: 'General' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
