import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  userId: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema: Schema = new Schema({
  userId: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<INotification>('Notification', NotificationSchema);
