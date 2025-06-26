const express = require('express');
const router = express.Router();
const financeController = require('../controllers/financeController');
const authMiddleware = require('../middleware/authMiddleware');

// --- Categories ---
router.post('/category', authMiddleware(), financeController.createCategory);
router.get('/categories', authMiddleware(), financeController.getCategories);
router.delete('/category/:id', authMiddleware(), financeController.deleteCategory);
router.patch('/category/:id', authMiddleware(), financeController.updateCategory);

// --- Transactions ---
router.post('/transaction', authMiddleware(), financeController.createTransaction);
router.get('/transactions', authMiddleware(), financeController.getTransactions);
router.delete('/transaction/:id', authMiddleware(), financeController.deleteTransaction);
router.patch('/transaction/:id', authMiddleware(), financeController.updateTransaction);

// --- Budgets ---
router.post('/budget', authMiddleware(), financeController.createBudget);
router.get('/budgets', authMiddleware(), financeController.getBudgets);
router.patch('/budget/:id', authMiddleware(), financeController.updateBudget);

// --- Goals ---
router.post('/goal', authMiddleware(), financeController.createGoal);
router.get('/goals', authMiddleware(), financeController.getGoals);
router.patch('/goal/:id', authMiddleware(), financeController.updateGoal);

// --- Analytics ---
router.get('/analytics/summary', authMiddleware(), financeController.getSummary);
router.get('/analytics/overbudget', authMiddleware(), financeController.getOverBudget);
router.get('/analytics/recommendations', authMiddleware(), financeController.getRecommendations);

// --- Doc Upload (stub) ---
router.post('/upload', authMiddleware(), financeController.uploadDoc);

// --- Expense Sharing ---
router.post('/share', authMiddleware(), financeController.shareExpense);

// --- Import and Export ---
router.post('/import', authMiddleware(), financeController.importTransactions);
router.get('/export', authMiddleware(), financeController.exportTransactions);

module.exports = router; 