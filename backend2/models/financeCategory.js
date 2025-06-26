const mongoose = require('mongoose');

const financeCategorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  budgetLimit: { type: Number }, // optional per-category budget
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FinanceCategory', financeCategorySchema); 