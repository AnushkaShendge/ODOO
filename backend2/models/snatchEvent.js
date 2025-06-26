const mongoose = require('mongoose');

const snatchEventSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startLocation: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  endLocation: {
    lat: { type: Number },
    lng: { type: Number }
  },
  route: [{ lat: Number, lng: Number }],
  status: { type: String, enum: ['active', 'resolved', 'fallback_sent'], default: 'active' },
  fallbackSent: { type: Boolean, default: false },
  policeStation: {
    name: String,
    address: String,
    lat: Number,
    lng: Number
  },
  createdAt: { type: Date, default: Date.now },
  resolvedAt: { type: Date }
});

module.exports = mongoose.model('SnatchEvent', snatchEventSchema); 