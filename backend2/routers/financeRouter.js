const express = require('express');
const router = express.Router();
const financeController = require('../controllers/financeController');

// --- Categories ---
router.post('/category', financeController.createCategory);
router.get('/categories', financeController.getCategories);
router.delete('/category/:id', financeController.deleteCategory);

// --- Transactions ---
router.post('/transaction', financeController.createTransaction);
router.get('/transactions', financeController.getTransactions);
router.delete('/transaction/:id', financeController.deleteTransaction);
router.patch('/transaction/:id', financeController.updateTransaction);

// --- Budgets ---
router.post('/budget', financeController.createBudget);
router.get('/budgets', financeController.getBudgets);

// --- Goals ---
router.post('/goal', financeController.createGoal);
router.get('/goals', financeController.getGoals);
router.patch('/goal/:id', financeController.updateGoal);

// --- Analytics ---
router.get('/analytics/summary', financeController.getSummary);
router.get('/analytics/overbudget', financeController.getOverBudget);
router.get('/analytics/recommendations', financeController.getRecommendations);

// --- Doc Upload (stub) ---
router.post('/upload', financeController.uploadDoc);

// --- Expense Sharing ---
router.post('/share', financeController.shareExpense);

module.exports = router; 