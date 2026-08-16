import mongoose from 'mongoose';

const ExtensionTaskSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', required: true },
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
  linkedinUrl: { type: String, required: true },
  message: { type: String, required: true },
  stepType: { type: String, enum: ['invite', 'message'], required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
}, { timestamps: true });

export default mongoose.models.ExtensionTask || mongoose.model('ExtensionTask', ExtensionTaskSchema);
