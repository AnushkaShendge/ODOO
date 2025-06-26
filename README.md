# Saheli Finance Backend (Shree)

This document describes the **Finance (Shree) backend module** for the Saheli platform. It is enterprise-grade, scalable, and ready for both production and interview/demo use.

---

## Features
- **Dynamic, user-specific categories and budgets**
- **Full CRUD for transactions, categories, budgets, and goals**
- **Expense/income tracking** with advanced filtering, pagination, and analytics
- **Expense sharing** with per-user split logic and granular role-based permissions
- **Recurring transactions and budgets** (monthly, weekly, biweekly, custom dates)
- **Bulk import/export** (CSV/JSON)
- **Audit log** for all changes
- **Real file upload for receipts** (with ML/AI extraction integration)
- **Currency support and real-time conversion**
- **Over-budget detection** with real-time notifications (Socket.IO, email, SMS)
- **Personalized recommendations** (ML/AI microservice integration)
- **JWT authentication and role-based access**
- **Swagger/OpenAPI documentation**
- **Group finance support:**
  - Group transactions, budgets, and analytics
  - Group approval workflow for shared transactions
  - Group-level notifications and permissions

---

## API Endpoints

### Categories
- `POST   /finance/category` — Create a new category
- `GET    /finance/categories` — List all categories for a user
- `PATCH  /finance/category/:id` — Edit a category
- `DELETE /finance/category/:id` — Delete a category

### Transactions
- `POST   /finance/transaction` — Add a new transaction (expense/income, sharing, attachment, currency, recurring, split logic, granular permissions)
- `GET    /finance/transactions` — List/filter transactions (with pagination)
- `PATCH  /finance/transaction/:id` — Edit a transaction
- `DELETE /finance/transaction/:id` — Delete a transaction
- `POST   /finance/transaction/:id/comment` — Add a comment to a transaction
- `POST   /finance/transaction/:id/approve` — Approve a group/shared transaction

### Budgets
- `POST   /finance/budget` — Set a budget (per category, per month, or overall, with currency, recurring, advanced recurrence)
- `GET    /finance/budgets` — List all budgets for a user
- `PATCH  /finance/budget/:id` — Edit a budget

### Goals
- `POST   /finance/goal` — Add a financial goal for a user
- `GET    /finance/goals` — List all goals for a user (with pagination)
- `PATCH  /finance/goal/:id` — Update a goal

### Analytics
- `GET    /finance/analytics/summary` — Get a summary of expenses/income (with currency conversion)
- `GET    /finance/analytics/overbudget` — Detect and list all over-budget categories/months (emits Socket.IO, email, and SMS notifications)
- `GET    /finance/analytics/recommendations` — Get personalized recommendations (calls ML microservice)

### Doc Upload & Extraction
- `POST   /finance/upload` — Upload a receipt/bill for AI extraction (real file upload, ML microservice)

### Expense Sharing
- `POST   /finance/share` — Mark a transaction as shared with other users (split logic, role-based sharing)

### Bulk Operations
- `POST   /finance/import` — Import transactions in bulk (CSV/JSON)
- `GET    /finance/export` — Export transactions in bulk (CSV/JSON)

### Group Finance
- `POST   /finance/group/:groupId/transaction` — Create a group transaction
- `GET    /finance/group/:groupId/transactions` — List all group transactions
- `PATCH  /finance/group/:groupId/transaction/:id` — Update a group transaction
- `DELETE /finance/group/:groupId/transaction/:id` — Delete a group transaction
- `POST   /finance/group/:groupId/transaction/:id/approve` — Approve a group transaction (approval workflow)
- `POST   /finance/group/:groupId/transaction/:id/reject` — Reject a group transaction (approval workflow)
- `POST   /finance/group/:groupId/budget` — Create a group budget
- `GET    /finance/group/:groupId/budgets` — List all group budgets
- `PATCH  /finance/group/:groupId/budget/:id` — Update a group budget
- `DELETE /finance/group/:groupId/budget/:id` — Delete a group budget
- `GET    /finance/group/:groupId/analytics/summary` — Group summary (income/expense)
- `GET    /finance/group/:groupId/analytics/overbudget` — Group over-budget detection
- `GET    /finance/group/:groupId/analytics/trends` — Group spending trends

---

## Advanced Capabilities
- **Transaction Splitting:** Equal/custom splits, auto-calculates per-user share
- **Recurring Transactions/Budgets:** Monthly, weekly, biweekly, custom dates
- **Audit Log:** All mutations (create/update) are logged for compliance
- **Currency Support:** All monetary models support a `currency` field (default: INR), with real-time conversion in analytics
- **Notifications:** Over-budget events emit a Socket.IO event, and send email/SMS notifications (configurable)
- **Pagination:** Supported for transactions and goals (`page` and `limit` query params)
- **ML/AI Integration:** Recommendations and doc extraction use real microservices (configurable via env)
- **Security:** All routes protected by JWT authentication and role-based access
- **Swagger/OpenAPI Docs:** See `backend2/swagger.yaml`
- **Group Approval Workflow:** Group transactions can require multiple member approvals (configurable per group). Approval/rejection is tracked and status is updated automatically. Notifications are sent to group members on approval/rejection.
- **Group Permissions:** Role-based access for group admins, members, and viewers
- **Group Notifications:** Over-budget and approval events can trigger group-level notifications

---

## Usage Notes
- **Environment Variables:**
  - `JWT_SECRET` for authentication
  - `ML_RECOMMENDATION_URL`, `ML_DOC_EXTRACTION_URL` for ML/AI integration
  - `EMAIL_USER`, `EMAIL_PASS` for email notifications
  - `TWILIO_SID`, `TWILIO_TOKEN`, `TWILIO_NUMBER` for SMS notifications
- **Socket.IO:** Connect to receive real-time over-budget notifications
- **File Uploads:** Receipts are stored in `uploads/` and sent to ML microservice for extraction
- **Currency Conversion:** Uses [exchangerate-api.com](https://www.exchangerate-api.com/) for real-time rates
- **Bulk Import/Export:** Use `/finance/import` and `/finance/export` for CSV/JSON operations
- **Group Finance:**
  - Only group members can access group finance endpoints
  - Approval workflow and permissions are enforced per group settings

---

## For Interview/Demo
- **Showcase advanced features:** Recurring, splitting, ML/AI, notifications, audit log, currency conversion, group finance, group approval workflow
- **Discuss extensibility:** Easy to add more analytics, notification channels, or ML models
- **Highlight compliance:** Audit log, role-based access, secure file handling, and group-level permissions

---

## License
MIT 