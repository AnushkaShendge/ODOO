import mongoose from 'mongoose';
const { Schema } = mongoose;

const AuditLogSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  eventType: { type: String, required: true, enum: ['SOS', 'SNATCH', 'LOCATION_SHARE', 'FAKE_CALL', 'CHATBOT', 'CONTACT', 'SAFETY_SCORE', 'OTHER'] },
  eventRef: { type: Schema.Types.ObjectId }, // Reference to the event (e.g., SOSAlert, SnatchEvent)
  details: { type: Schema.Types.Mixed }, // Arbitrary event details
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('AuditLog', AuditLogSchema); 