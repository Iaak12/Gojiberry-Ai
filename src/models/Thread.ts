import mongoose from 'mongoose';

const ThreadSchema = new mongoose.Schema({
  leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', required: true },
  userEmail: { type: String, required: true },
  messages: [{ type: String }],
}, { timestamps: true });

export default mongoose.models.Thread || mongoose.model('Thread', ThreadSchema);
