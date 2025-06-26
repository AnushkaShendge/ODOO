const mongoose = require('mongoose');

const financeBudgetSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'FinanceCategory' }, // null for overall
  month: { type: String }, // e.g. '2024-06'
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  recurring: { type: Boolean, default: false },
  recurrenceRule: { type: String }, // e.g. 'monthly', 'weekly', 'custom'
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FinanceBudget', financeBudgetSchema); 