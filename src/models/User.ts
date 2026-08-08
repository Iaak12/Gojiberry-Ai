import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  website: { type: String },
  geminiKey: { type: String, default: '' },
  dailyLimit: { type: String, default: '50' },
  warmup: { type: Boolean, default: true },
  excludeDomains: { type: String, default: '' },
  icp: {
    companyDescription: { type: String, default: '' },
    targetRoles: [{ type: String }],
    targetIndustries: [{ type: String }],
    valueProposition: { type: String, default: '' },
    companySize: { type: String, default: '' },
    geography: { type: String, default: '' },
  },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
