import mongoose, { Schema, Document } from 'mongoose';

export interface IWorkflow extends Document {
  title: string;
  status: 'pending' | 'approved' | 'rejected';
  createdBy: string;
  assignedTo: string;
  amount: number;
  createdAt: Date;
}

const WorkflowSchema: Schema = new Schema({
  title: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdBy: { type: String, required: true },
  assignedTo: { type: String, required: true },
  amount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IWorkflow>('Workflow', WorkflowSchema);
