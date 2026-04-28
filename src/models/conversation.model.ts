import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  name?: string;
  tool_call_id?: string;
}

export interface IConversation extends Document {
  userId: string;
  messages: IMessage[];
  lastIntent?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema: Schema = new Schema({
  userId: { type: String, required: true, index: true },
  messages: [
    {
      role: { type: String, enum: ['system', 'user', 'assistant', 'tool'], required: true },
      content: { type: String, required: true },
      name: { type: String },
      tool_call_id: { type: String },
    },
  ],
  lastIntent: { type: String },
}, { timestamps: true });

export default mongoose.model<IConversation>('Conversation', ConversationSchema);
