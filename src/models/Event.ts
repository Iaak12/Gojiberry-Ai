import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  title: { type: String, required: true },
  company: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  type: { type: String, required: true },
  color: { type: String, required: true },
  status: { type: String, required: true },
  meetingUrl: { type: String },
  prospectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead' },
}, { timestamps: true });

export default mongoose.models.Event || mongoose.model('Event', EventSchema);
