const mongoose = require('mongoose');

const safetyScoreSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  score: { type: Number, default: 100 },
  history: [
    {
      date: { type: Date, default: Date.now },
      change: Number,
      reason: String
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('SafetyScore', safetyScoreSchema); 