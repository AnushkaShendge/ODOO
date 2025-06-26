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
router.post('/transaction/:id/comment', authMiddleware(), financeController.addTransactionComment);
router.post('/transaction/:id/approve', authMiddleware(), financeController.approveGroupTransaction);

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
router.get('/analytics/cashflow', authMiddleware(), financeController.getCashFlowForecast);
router.get('/analytics/trends', authMiddleware(), financeController.getSpendingTrends);
router.get('/analytics/savings-rate', authMiddleware(), financeController.getSavingsRate);
router.get('/analytics/net-worth', authMiddleware(), financeController.getNetWorth);
router.get('/analytics/tax-estimation', authMiddleware(), financeController.getTaxEstimation);

// --- Doc Upload (stub) ---
router.post('/upload', authMiddleware(), financeController.uploadDoc);

// --- Expense Sharing ---
router.post('/share', authMiddleware(), financeController.shareExpense);

// --- Import and Export ---
router.post('/import', authMiddleware(), financeController.importTransactions);
router.get('/export', authMiddleware(), financeController.exportTransactions);

// --- Auto-categorization ---
router.post('/auto-categorize', authMiddleware(), financeController.autoCategorize);
router.get('/bill-reminders', authMiddleware(), financeController.getBillReminders);
router.get('/detect-duplicates', authMiddleware(), financeController.detectDuplicates);

// --- Dashboard Config ---
router.post('/dashboard-config', authMiddleware(), financeController.saveDashboardConfig);
router.get('/dashboard-config', authMiddleware(), financeController.getDashboardConfig);
router.get('/budget-suggestions', authMiddleware(), financeController.getBudgetSuggestions);
router.get('/personalized-tips', authMiddleware(), financeController.getPersonalizedTips);

// --- GDPR Export/Delete ---
router.get('/gdpr/export', authMiddleware(), financeController.exportFinanceData);
router.delete('/gdpr/delete', authMiddleware(), financeController.deleteFinanceData);

// --- Audit Log Export ---
router.get('/audit/export', authMiddleware(), financeController.exportAuditLog);

// --- Investment/Loan/Invoice/Payment Stubs ---
router.get('/investments', authMiddleware(), financeController.listInvestments);
router.get('/loans', authMiddleware(), financeController.listLoans);
router.get('/invoices', authMiddleware(), financeController.listInvoices);
router.get('/payments', authMiddleware(), financeController.listPayments);

// --- Push Notification ---
router.post('/notify/push', authMiddleware(), financeController.sendPushNotification);
router.post('/notify/rule', authMiddleware(), financeController.setNotificationRule);

// --- Group Finance ---
router.post('/group/:groupId/transaction', authMiddleware(), financeController.createGroupTransaction);
router.get('/group/:groupId/transactions', authMiddleware(), financeController.getGroupTransactions);
router.patch('/group/:groupId/transaction/:id', authMiddleware(), financeController.updateGroupTransaction);
router.delete('/group/:groupId/transaction/:id', authMiddleware(), financeController.deleteGroupTransaction);
router.post('/group/:groupId/transaction/:id/approve', authMiddleware(), financeController.approveGroupTransaction);
router.post('/group/:groupId/transaction/:id/reject', authMiddleware(), financeController.rejectGroupTransaction);

router.post('/group/:groupId/budget', authMiddleware(), financeController.createGroupBudget);
router.get('/group/:groupId/budgets', authMiddleware(), financeController.getGroupBudgets);
router.patch('/group/:groupId/budget/:id', authMiddleware(), financeController.updateGroupBudget);
router.delete('/group/:groupId/budget/:id', authMiddleware(), financeController.deleteGroupBudget);

router.get('/group/:groupId/analytics/summary', authMiddleware(), financeController.getGroupSummary);
router.get('/group/:groupId/analytics/overbudget', authMiddleware(), financeController.getGroupOverBudget);
router.get('/group/:groupId/analytics/trends', authMiddleware(), financeController.getGroupSpendingTrends);

module.exports = router; 