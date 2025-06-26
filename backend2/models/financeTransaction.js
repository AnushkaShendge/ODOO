const mongoose = require('mongoose');

const financeTransactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['expense', 'income'], required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'FinanceCategory', required: true },
  date: { type: Date, default: Date.now },
  description: { type: String },
  tags: { type: [String], default: [] },
  sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  attachment: { type: String }, // file path or URL
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FinanceTransaction', financeTransactionSchema); 