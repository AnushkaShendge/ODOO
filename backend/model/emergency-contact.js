import mongoose from 'mongoose';
const { Schema } = mongoose;

const EmergencyContactSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' }, // null for global/admin contacts
  name: { type: String, required: true },
  phone: { type: String, required: true },
  type: { type: String, enum: ['personal', 'police', 'ambulance', 'fire', 'support', 'admin'], default: 'personal' },
  country: { type: String },
  city: { type: String },
  isGlobal: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('EmergencyContact', EmergencyContactSchema); 