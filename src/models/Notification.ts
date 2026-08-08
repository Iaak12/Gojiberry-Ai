import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  icon: { type: String, required: true },
  msg: { type: String, required: true },
  time: { type: String, required: true },
  unread: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
