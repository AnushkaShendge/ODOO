const mongoose = require('mongoose');

const splitAmountSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  share: { type: Number, required: true }
}, { _id: false });

const financeTransactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['expense', 'income'], required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'FinanceCategory', required: true },
  date: { type: Date, default: Date.now },
  description: { type: String },
  tags: { type: [String], default: [] },
  sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  sharedWithRoles: { type: [String], default: [] },
  splitType: { type: String, enum: ['equal', 'custom'], default: 'equal' },
  splitAmounts: [splitAmountSchema],
  attachment: { type: String }, // file path or URL
  currency: { type: String, default: 'INR' },
  recurring: { type: Boolean, default: false },
  recurrenceRule: { type: String }, // e.g. 'monthly', 'weekly', 'custom'
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FinanceTransaction', financeTransactionSchema); 