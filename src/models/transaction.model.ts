import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  userId: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  createdAt: Date;
}

const TransactionSchema: Schema = new Schema({
  userId: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['credit', 'debit'], required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);
