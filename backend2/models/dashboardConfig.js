const mongoose = require('mongoose');

const dashboardConfigSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  widgets: { type: [String], default: [] },
  layout: { type: Object, default: {} },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DashboardConfig', dashboardConfigSchema); 