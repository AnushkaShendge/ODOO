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