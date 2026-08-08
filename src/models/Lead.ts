import mongoose from 'mongoose';

const LeadSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  company: { type: String, required: true },
  initials: { type: String, required: true },
  color: { type: String, required: true },
  score: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'contacted', 'replied', 'booked'], required: true },
  signal: { type: String, required: true },
  time: { type: String, required: true },
  email: { type: String, required: true },
  linkedin: { type: String, required: true },
  industry: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Lead || mongoose.model('Lead', LeadSchema);
