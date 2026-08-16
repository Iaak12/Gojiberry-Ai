import mongoose from 'mongoose';

const AgentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['autopilot', 'one-time'], default: 'autopilot' },
  status: { type: String, enum: ['active', 'paused'], default: 'active' },
  icp: {
    jobTitles: [{ type: String }],
    industries: [{ type: String }],
    industryPrompt: { type: String, default: '' },
    companySize: [{ type: String }],
    locations: [{ type: String }],
    companyTypes: [{ type: String }],
    exclusions: [{ type: String }],
  },
  signals: {
    companyPages: [{ type: String }],
    interestKeywords: [{ type: String }],
    creators: [{ type: String }],
    trackTop5Percent: { type: Boolean, default: false },
    raisedFunds: { type: Boolean, default: false },
    recentJobChanges: { type: Boolean, default: false },
    linkedInGroups: [{ type: String }],
    linkedInEvents: [{ type: String }],
    competitors: [{ type: String }],
    excludedCompanies: [{ type: String }],
  },
  leadManagement: {
    targetListId: { type: String },
  }
}, { timestamps: true });

export default mongoose.models.Agent || mongoose.model('Agent', AgentSchema);
