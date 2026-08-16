import mongoose from 'mongoose';

const CampaignSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  listId: { type: String, required: true },
  status: { type: String, enum: ['active', 'paused', 'completed'], default: 'active' },
  sequence: [{
    stepType: { type: String, enum: ['invite', 'message', 'email'] },
    template: { type: String },
    delayDays: { type: Number, default: 0 },
  }],
}, { timestamps: true });

export default mongoose.models.Campaign || mongoose.model('Campaign', CampaignSchema);
