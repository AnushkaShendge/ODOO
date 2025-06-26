const FinanceTransaction = require('../models/financeTransaction');
const FinanceCategory = require('../models/financeCategory');
const FinanceBudget = require('../models/financeBudget');
const FinanceGoal = require('../models/financeGoal');
const User = require('../models/user');
const mongoose = require('mongoose');
const AuditLog = require('../models/auditLog');
const { getIO } = require('../utils/socketInstance');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const axios = require('axios');
const fs = require('fs');
const csv = require('csv-parser');
const { Parser } = require('json2csv');
const DashboardConfig = require('../models/dashboardConfig');
const Group = require('../models/group');

// --- CATEGORY ---
exports.createCategory = async (req, res) => {
  try {
    const { userId, name, budgetLimit } = req.body;
    if (!userId || !name) return res.status(400).json({ error: 'userId and name required' });
    const category = await FinanceCategory.create({ user: userId, name, budgetLimit });
    res.status(201).json({ success: true, category });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
exports.getCategories = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    const categories = await FinanceCategory.find({ user: userId });
    res.json({ success: true, categories });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await FinanceCategory.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const category = await FinanceCategory.findByIdAndUpdate(id, update, { new: true });
    await AuditLog.create({ user: category.user, action: 'updateCategory', details: { id, update } });
    res.json({ success: true, category });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// --- TRANSACTION ---
exports.createTransaction = async (req, res) => {
  try {
    const { userId, amount, type, category, date, description, tags, sharedWith, attachment, splitType, splitAmounts, currency } = req.body;
    if (!userId || !amount || !type || !category) return res.status(400).json({ error: 'Missing required fields' });
    let finalSplitAmounts = splitAmounts;
    if (splitType === 'equal' && sharedWith && sharedWith.length > 0) {
      const totalUsers = sharedWith.length + 1;
      const share = amount / totalUsers;
      finalSplitAmounts = [{ user: userId, share }, ...sharedWith.map(u => ({ user: u, share }))];
    }
    const tx = await FinanceTransaction.create({ user: userId, amount, type, category, date, description, tags, sharedWith, splitType, splitAmounts: finalSplitAmounts, attachment, currency });
    await AuditLog.create({ user: userId, action: 'createTransaction', details: tx });
    res.status(201).json({ success: true, transaction: tx });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
exports.getTransactions = async (req, res) => {
  try {
    const { userId, type, category, startDate, endDate, page = 1, limit = 20 } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    const filter = { user: userId };
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    const txs = await FinanceTransaction.find(filter)
      .populate('category sharedWith')
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ success: true, transactions: txs });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    await FinanceTransaction.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const tx = await FinanceTransaction.findByIdAndUpdate(id, update, { new: true });
    res.json({ success: true, transaction: tx });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// --- BUDGET ---
exports.createBudget = async (req, res) => {
  try {
    const { userId, category, month, amount } = req.body;
    if (!userId || !amount) return res.status(400).json({ error: 'userId and amount required' });
    const budget = await FinanceBudget.create({ user: userId, category, month, amount });
    res.status(201).json({ success: true, budget });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
exports.getBudgets = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    const budgets = await FinanceBudget.find({ user: userId }).populate('category');
    res.json({ success: true, budgets });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
exports.updateBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const budget = await FinanceBudget.findByIdAndUpdate(id, update, { new: true });
    await AuditLog.create({ user: budget.user, action: 'updateBudget', details: { id, update } });
    res.json({ success: true, budget });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// --- GOAL ---
exports.createGoal = async (req, res) => {
  try {
    const { userId, name, targetAmount, deadline, description } = req.body;
    if (!userId || !name || !targetAmount) return res.status(400).json({ error: 'Missing required fields' });
    const goal = await FinanceGoal.create({ user: userId, name, targetAmount, deadline, description });
    res.status(201).json({ success: true, goal });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
exports.getGoals = async (req, res) => {
  try {
    const { userId, page = 1, limit = 20 } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    const goals = await FinanceGoal.find({ user: userId })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ success: true, goals });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
exports.updateGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const goal = await FinanceGoal.findByIdAndUpdate(id, update, { new: true });
    res.json({ success: true, goal });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// --- ANALYTICS ---
const getConversionRate = async (from, to) => {
  if (from === to) return 1;
  const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${from}`);
  return response.data.rates[to] || 1;
};
exports.getSummary = async (req, res) => {
  try {
    const { userId, month, currency = 'INR' } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    const match = { user: mongoose.Types.ObjectId(userId) };
    if (month) {
      const [year, m] = month.split('-');
      const start = new Date(`${year}-${m}-01`);
      const end = new Date(start);
      end.setMonth(end.getMonth() + 1);
      match.date = { $gte: start, $lt: end };
    }
    const summary = await FinanceTransaction.aggregate([
      { $match: match },
      { $group: {
        _id: { type: '$type', currency: '$currency' },
        total: { $sum: '$amount' }
      }}
    ]);
    // Convert all to requested currency
    const converted = await Promise.all(summary.map(async s => {
      const rate = await getConversionRate(s._id.currency, currency);
      return { type: s._id.type, total: s.total * rate, currency };
    }));
    res.json({ success: true, summary: converted });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
exports.getOverBudget = async (req, res) => {
  try {
    const { userId, month } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    // Get all budgets for user
    const budgets = await FinanceBudget.find({ user: userId });
    // For each budget, sum transactions and compare
    const overBudget = [];
    for (const budget of budgets) {
      const match = { user: userId };
      if (budget.category) match.category = budget.category;
      if (budget.month) {
        const [year, m] = budget.month.split('-');
        const start = new Date(`${year}-${m}-01`);
        const end = new Date(start);
        end.setMonth(end.getMonth() + 1);
        match.date = { $gte: start, $lt: end };
      }
      const total = await FinanceTransaction.aggregate([
        { $match: match },
        { $group: { _id: null, sum: { $sum: '$amount' } } }
      ]);
      const spent = total[0]?.sum || 0;
      if (spent > budget.amount) {
        overBudget.push({ budget, spent, overBy: spent - budget.amount });
        // Emit notification (stub)
        const io = getIO();
        if (io) io.to(userId.toString()).emit('overBudget', { budget, spent, overBy: spent - budget.amount });
      }
    }
    res.json({ success: true, overBudget });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// --- RECOMMENDATIONS (stub) ---
exports.getRecommendations = async (req, res) => {
  try {
    // Call ML microservice
    const { userId } = req.query;
    const response = await axios.post(process.env.ML_RECOMMENDATION_URL, { userId });
    res.json({ success: true, recommendations: response.data.recommendations });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- DOC UPLOAD (stub) ---
exports.uploadDoc = [
  upload.single('file'),
  async (req, res) => {
    try {
      const filePath = req.file ? req.file.path : null;
      let extracted = {};
      if (filePath) {
        // Call ML doc extraction microservice
        const formData = new FormData();
        formData.append('file', fs.createReadStream(filePath));
        const response = await axios.post(process.env.ML_DOC_EXTRACTION_URL, formData, { headers: formData.getHeaders() });
        extracted = response.data;
      }
      res.json({ success: true, extracted, message: 'ML extraction complete' });
    } catch (err) { res.status(500).json({ error: err.message }); }
  }
];

// --- EXPENSE SHARING ---
exports.shareExpense = async (req, res) => {
  try {
    const { transactionId, sharedWith } = req.body;
    if (!transactionId || !sharedWith || !Array.isArray(sharedWith)) return res.status(400).json({ error: 'transactionId and sharedWith[] required' });
    const tx = await FinanceTransaction.findById(transactionId);
    if (!tx) return res.status(404).json({ error: 'Transaction not found' });
    tx.sharedWith = sharedWith;
    await tx.save();
    res.json({ success: true, transaction: tx });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.importTransactions = [
  upload.single('file'),
  async (req, res) => {
    try {
      const filePath = req.file ? req.file.path : null;
      if (!filePath) return res.status(400).json({ error: 'No file uploaded' });
      const results = [];
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
          const inserted = await FinanceTransaction.insertMany(results);
          res.json({ success: true, inserted });
        });
    } catch (err) { res.status(500).json({ error: err.message }); }
  }
];
exports.exportTransactions = async (req, res) => {
  try {
    const { userId, format = 'json' } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    const txs = await FinanceTransaction.find({ user: userId });
    if (format === 'csv') {
      const parser = new Parser();
      const csvData = parser.parse(txs.map(tx => tx.toObject()));
      res.header('Content-Type', 'text/csv');
      res.attachment('transactions.csv');
      return res.send(csvData);
    }
    res.json({ success: true, transactions: txs });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getCashFlowForecast = async (req, res) => {
  try {
    const { userId, months = 3 } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    // Example: forecast next N months based on average net cash flow
    const txs = await FinanceTransaction.find({ user: userId });
    const income = txs.filter(t => t.type === 'income').reduce((a, b) => a + b.amount, 0);
    const expense = txs.filter(t => t.type === 'expense').reduce((a, b) => a + b.amount, 0);
    const avgNet = (income - expense) / (txs.length || 1);
    const forecast = Array.from({ length: months }, (_, i) => ({ month: i + 1, projectedNet: avgNet }));
    res.json({ success: true, forecast });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
exports.getSpendingTrends = async (req, res) => {
  try {
    const { userId, period = 'month' } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    // Example: group by category and period
    const txs = await FinanceTransaction.find({ user: userId, type: 'expense' });
    const trends = {};
    txs.forEach(tx => {
      const key = `${tx.category}_${tx.date.getFullYear()}-${tx.date.getMonth() + 1}`;
      trends[key] = (trends[key] || 0) + tx.amount;
    });
    res.json({ success: true, trends });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
exports.getSavingsRate = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    const txs = await FinanceTransaction.find({ user: userId });
    const income = txs.filter(t => t.type === 'income').reduce((a, b) => a + b.amount, 0);
    const expense = txs.filter(t => t.type === 'expense').reduce((a, b) => a + b.amount, 0);
    const savingsRate = income ? ((income - expense) / income) * 100 : 0;
    res.json({ success: true, savingsRate });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
exports.getNetWorth = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    // Example: sum of all income minus all expenses (simple net worth)
    const txs = await FinanceTransaction.find({ user: userId });
    const income = txs.filter(t => t.type === 'income').reduce((a, b) => a + b.amount, 0);
    const expense = txs.filter(t => t.type === 'expense').reduce((a, b) => a + b.amount, 0);
    const netWorth = income - expense;
    res.json({ success: true, netWorth });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
exports.getTaxEstimation = async (req, res) => {
  try {
    const { userId, year = new Date().getFullYear() } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    // Example: simple flat tax rate
    const txs = await FinanceTransaction.find({ user: userId, type: 'income' });
    const income = txs.filter(t => t.date.getFullYear() === Number(year)).reduce((a, b) => a + b.amount, 0);
    const tax = income * 0.2; // 20% flat
    res.json({ success: true, estimatedTax: tax });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
exports.autoCategorize = async (req, res) => {
  try {
    const { userId, description } = req.body;
    if (!userId || !description) return res.status(400).json({ error: 'userId and description required' });
    // ML/NLP stub: call microservice or use regex/keywords
    // Example: if description contains 'uber', return 'Transport'
    let category = 'Other';
    if (/uber|ola|taxi/i.test(description)) category = 'Transport';
    else if (/swiggy|zomato|food/i.test(description)) category = 'Food';
    else if (/rent|lease/i.test(description)) category = 'Housing';
    // ... more rules or ML call
    res.json({ success: true, category });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
exports.getBillReminders = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    // Stub: find upcoming recurring transactions
    const now = new Date();
    const txs = await FinanceTransaction.find({ user: userId, recurring: true });
    const reminders = txs.filter(tx => {
      // Simple: if due in next 7 days
      const nextDue = new Date(tx.date);
      while (nextDue < now) {
        if (tx.recurrenceRule === 'monthly') nextDue.setMonth(nextDue.getMonth() + 1);
        else if (tx.recurrenceRule === 'weekly') nextDue.setDate(nextDue.getDate() + 7);
        else if (tx.recurrenceRule === 'biweekly') nextDue.setDate(nextDue.getDate() + 14);
        else break;
      }
      return (nextDue - now) < 7 * 24 * 60 * 60 * 1000 && (nextDue - now) > 0;
    });
    res.json({ success: true, reminders });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
exports.detectDuplicates = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    // Simple: find transactions with same amount, date, and description
    const txs = await FinanceTransaction.find({ user: userId });
    const seen = {};
    const duplicates = [];
    txs.forEach(tx => {
      const key = `${tx.amount}_${tx.date.toISOString().slice(0,10)}_${tx.description}`;
      if (seen[key]) duplicates.push([seen[key], tx]);
      else seen[key] = tx;
    });
    res.json({ success: true, duplicates });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.saveDashboardConfig = async (req, res) => {
  try {
    const { userId, widgets, layout } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    const config = await DashboardConfig.findOneAndUpdate(
      { user: userId },
      { widgets, layout, updatedAt: new Date() },
      { upsert: true, new: true }
    );
    res.json({ success: true, config });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
exports.getDashboardConfig = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    const config = await DashboardConfig.findOne({ user: userId });
    res.json({ success: true, config });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
exports.getBudgetSuggestions = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    // Suggest budget as average of last 3 months + 10% buffer per category
    const now = new Date();
    const txs = await FinanceTransaction.find({ user: userId, type: 'expense' });
    const byCategory = {};
    txs.forEach(tx => {
      const cat = tx.category.toString();
      if (!byCategory[cat]) byCategory[cat] = [];
      byCategory[cat].push(tx);
    });
    const suggestions = {};
    for (const cat in byCategory) {
      const last3 = byCategory[cat].filter(tx => (now - tx.date) < 90 * 24 * 60 * 60 * 1000);
      const avg = last3.reduce((a, b) => a + b.amount, 0) / (last3.length || 1);
      suggestions[cat] = Math.round(avg * 1.1);
    }
    res.json({ success: true, suggestions });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
exports.getPersonalizedTips = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    // Example: rule-based tips
    const txs = await FinanceTransaction.find({ user: userId });
    const income = txs.filter(t => t.type === 'income').reduce((a, b) => a + b.amount, 0);
    const food = txs.filter(t => t.type === 'expense' && /food|swiggy|zomato/i.test(t.description)).reduce((a, b) => a + b.amount, 0);
    const tips = [];
    if (income && food / income > 0.3) tips.push('You spent more than 30% of your income on food last month. Consider cooking at home.');
    if (income && txs.filter(t => t.type === 'expense').reduce((a, b) => a + b.amount, 0) > income) tips.push('Your expenses exceeded your income. Review your spending habits.');
    if (tips.length === 0) tips.push('Keep up the good work!');
    res.json({ success: true, tips });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// Add a comment to a transaction
exports.addTransactionComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const userId = req.user.id;
    const tx = await FinanceTransaction.findById(id);
    if (!tx) return res.status(404).json({ message: 'Transaction not found' });
    tx.comments.push({ user: userId, text });
    await tx.save();
    res.status(201).json(tx.comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Approve a group/shared transaction (with workflow)
exports.approveGroupTransaction = async (req, res) => {
  try {
    const { groupId, id } = req.params;
    const userId = req.user.id;
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });
    const member = group.members.find(m => m.user.toString() === userId);
    if (!member) return res.status(403).json({ message: 'Not a group member' });
    const tx = await FinanceTransaction.findOne({ _id: id, group: groupId });
    if (!tx) return res.status(404).json({ message: 'Transaction not found' });
    if (tx.status !== 'pending') return res.status(400).json({ message: 'Transaction already finalized' });
    if (tx.approvals.find(a => a.user.toString() === userId)) return res.status(400).json({ message: 'Already approved' });
    tx.approvals.push({ user: userId, approved: true });
    tx.approvalHistory.push({ user: userId, action: 'approved' });
    // Check if enough approvals
    const minApprovals = group.approvalWorkflow?.minApprovals || 1;
    const approvedCount = tx.approvals.filter(a => a.approved).length;
    if (approvedCount >= minApprovals) tx.status = 'approved';
    await tx.save();
    // TODO: Notify group members (Socket.IO, email, push)
    res.status(200).json({ status: tx.status, approvals: tx.approvals });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
// Reject a group/shared transaction
exports.rejectGroupTransaction = async (req, res) => {
  try {
    const { groupId, id } = req.params;
    const userId = req.user.id;
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });
    const member = group.members.find(m => m.user.toString() === userId);
    if (!member) return res.status(403).json({ message: 'Not a group member' });
    const tx = await FinanceTransaction.findOne({ _id: id, group: groupId });
    if (!tx) return res.status(404).json({ message: 'Transaction not found' });
    if (tx.status !== 'pending') return res.status(400).json({ message: 'Transaction already finalized' });
    if (tx.approvals.find(a => a.user.toString() === userId)) return res.status(400).json({ message: 'Already acted' });
    tx.approvals.push({ user: userId, approved: false });
    tx.approvalHistory.push({ user: userId, action: 'rejected' });
    tx.status = 'rejected';
    await tx.save();
    // TODO: Notify group members (Socket.IO, email, push)
    res.status(200).json({ status: tx.status, approvals: tx.approvals });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// GDPR: Export user finance data
exports.exportFinanceData = async (req, res) => {
  try {
    const userId = req.user.id;
    // Export all user finance data (transactions, budgets, goals, etc.)
    // This is a simple JSON export; for CSV, add conversion logic
    const [transactions, budgets, goals] = await Promise.all([
      FinanceTransaction.find({ user: userId }),
      FinanceBudget.find({ user: userId }),
      FinanceGoal.find({ user: userId })
    ]);
    res.json({ transactions, budgets, goals });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GDPR: Delete user finance data
exports.deleteFinanceData = async (req, res) => {
  try {
    const userId = req.user.id;
    await Promise.all([
      FinanceTransaction.deleteMany({ user: userId }),
      FinanceBudget.deleteMany({ user: userId }),
      FinanceGoal.deleteMany({ user: userId })
    ]);
    res.json({ message: 'Finance data deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Audit log export
exports.exportAuditLog = async (req, res) => {
  try {
    const userId = req.user.id;
    const logs = await AuditLog.find({ user: userId });
    res.json({ logs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Investment stub
exports.listInvestments = async (req, res) => {
  res.json({ investments: [] }); // TODO: Implement
};
// Loan stub
exports.listLoans = async (req, res) => {
  res.json({ loans: [] }); // TODO: Implement
};
// Invoice stub
exports.listInvoices = async (req, res) => {
  res.json({ invoices: [] }); // TODO: Implement
};
// Payment stub
exports.listPayments = async (req, res) => {
  res.json({ payments: [] }); // TODO: Implement
};

// Push notification (FCM) stub
exports.sendPushNotification = async (req, res) => {
  // TODO: Integrate with FCM or other push provider
  // Example: send push to user(s) on over-budget or custom rule
  res.json({ message: 'Push notification sent (stub)' });
};

// Custom notification rules (user-configurable)
exports.setNotificationRule = async (req, res) => {
  // TODO: Save user notification rule (e.g., threshold, type, channel)
  res.json({ message: 'Notification rule saved (stub)' });
};

// --- GROUP FINANCE ---
// Helper: Check group membership
async function checkGroupMember(groupId, userId) {
  const group = await Group.findById(groupId);
  if (!group) throw new Error('Group not found');
  const member = group.members.find(m => m.user.toString() === userId);
  if (!member) throw new Error('Not a group member');
  return member;
}

// Group Transactions
exports.createGroupTransaction = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.id;
    await checkGroupMember(groupId, userId);
    const { amount, type, category, date, description, tags, splitType, splitAmounts, currency } = req.body;
    if (!amount || !type || !category) return res.status(400).json({ error: 'Missing required fields' });
    const tx = await FinanceTransaction.create({ group: groupId, user: userId, amount, type, category, date, description, tags, splitType, splitAmounts, currency });
    res.status(201).json({ success: true, transaction: tx });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
exports.getGroupTransactions = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.id;
    await checkGroupMember(groupId, userId);
    const txs = await FinanceTransaction.find({ group: groupId });
    res.json({ success: true, transactions: txs });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
exports.updateGroupTransaction = async (req, res) => {
  try {
    const { groupId, id } = req.params;
    const userId = req.user.id;
    await checkGroupMember(groupId, userId);
    const update = req.body;
    const tx = await FinanceTransaction.findOneAndUpdate({ _id: id, group: groupId }, update, { new: true });
    res.json({ success: true, transaction: tx });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
exports.deleteGroupTransaction = async (req, res) => {
  try {
    const { groupId, id } = req.params;
    const userId = req.user.id;
    await checkGroupMember(groupId, userId);
    await FinanceTransaction.findOneAndDelete({ _id: id, group: groupId });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// Group Budgets
exports.createGroupBudget = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.id;
    await checkGroupMember(groupId, userId);
    const { category, month, amount } = req.body;
    if (!amount) return res.status(400).json({ error: 'Amount required' });
    const budget = await FinanceBudget.create({ group: groupId, user: userId, category, month, amount });
    res.status(201).json({ success: true, budget });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
exports.getGroupBudgets = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.id;
    await checkGroupMember(groupId, userId);
    const budgets = await FinanceBudget.find({ group: groupId });
    res.json({ success: true, budgets });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
exports.updateGroupBudget = async (req, res) => {
  try {
    const { groupId, id } = req.params;
    const userId = req.user.id;
    await checkGroupMember(groupId, userId);
    const update = req.body;
    const budget = await FinanceBudget.findOneAndUpdate({ _id: id, group: groupId }, update, { new: true });
    res.json({ success: true, budget });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
exports.deleteGroupBudget = async (req, res) => {
  try {
    const { groupId, id } = req.params;
    const userId = req.user.id;
    await checkGroupMember(groupId, userId);
    await FinanceBudget.findOneAndDelete({ _id: id, group: groupId });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// Group Analytics
exports.getGroupSummary = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.id;
    await checkGroupMember(groupId, userId);
    const summary = await FinanceTransaction.aggregate([
      { $match: { group: mongoose.Types.ObjectId(groupId) } },
      { $group: { _id: '$type', total: { $sum: '$amount' } } }
    ]);
    res.json({ success: true, summary });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
exports.getGroupOverBudget = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.id;
    await checkGroupMember(groupId, userId);
    const budgets = await FinanceBudget.find({ group: groupId });
    const overBudget = [];
    for (const budget of budgets) {
      const match = { group: groupId };
      if (budget.category) match.category = budget.category;
      if (budget.month) {
        const [year, m] = budget.month.split('-');
        const start = new Date(`${year}-${m}-01`);
        const end = new Date(start);
        end.setMonth(end.getMonth() + 1);
        match.date = { $gte: start, $lt: end };
      }
      const total = await FinanceTransaction.aggregate([
        { $match: match },
        { $group: { _id: null, sum: { $sum: '$amount' } } }
      ]);
      const spent = total[0]?.sum || 0;
      if (spent > budget.amount) {
        overBudget.push({ budget, spent, overBy: spent - budget.amount });
      }
    }
    res.json({ success: true, overBudget });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
exports.getGroupSpendingTrends = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.id;
    await checkGroupMember(groupId, userId);
    const txs = await FinanceTransaction.find({ group: groupId, type: 'expense' });
    const trends = {};
    txs.forEach(tx => {
      const key = `${tx.category}_${tx.date.getFullYear()}-${tx.date.getMonth() + 1}`;
      trends[key] = (trends[key] || 0) + tx.amount;
    });
    res.json({ success: true, trends });
  } catch (err) { res.status(500).json({ error: err.message }); }
}; 