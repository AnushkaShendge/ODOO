import mongoose from 'mongoose';
const { Schema } = mongoose;

const SOSAlertSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  status: { type: String, enum: ['pending', 'active', 'resolved', 'cancelled'], default: 'pending' },
  otp: { type: String },
  otpExpires: { type: Date },
  media: [{
    type: { type: String, enum: ['audio', 'video'] },
    url: { type: String }
  }],
  resolvedAt: { type: Date },
  resolvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

SOSAlertSchema.index({ location: '2dsphere' });

export default mongoose.model('SOSAlert', SOSAlertSchema);
