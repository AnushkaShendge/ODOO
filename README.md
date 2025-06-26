# Saheli Platform Backend (Shree & Shakti)

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)
![Platform](https://img.shields.io/badge/platform-Node.js%20%7C%20Express%20%7C%20MongoDB-blue)

---

> **Saheli Platform Backend** powers the Shree (Finance) and Shakti (Safety) modules for the Saheli platform. It is production-grade, scalable, and extensible, supporting real-time features, ML/AI integration, robust security, and a modular architecture. Designed for both enterprise and demo/interview use.

---

## 🛡️ Shakti (Safety) Module

The Shakti module provides a comprehensive, real-time safety suite for users, including SOS alerts, emergency contacts, location sharing, fake calls, snatch detection, safety scoring, audit logging, and more. All endpoints are secure, auditable, and extensible for future features.

| Feature                | Description                                                                                 |
|-----------------------|---------------------------------------------------------------------------------------------|
| **SOS Alerts**        | One-tap SOS with OTP, location, media upload, multi-channel notification, audit, analytics   |
| **Emergency Contacts**| CRUD for personal/global contacts, location-based, multi-type (police, ambulance, etc.)      |
| **Location Sharing**  | Real-time sharing to all contacts, with audit and notification                               |
| **Fake Call**         | Trigger fake incoming call for safety diversion                                              |
| **Snatch Detection**  | Report snatch event, ML route prediction stub, notify guardians                             |
| **Safety Score**      | Dynamic score based on user actions, with tips and gamification                             |
| **Audit Log**         | Unified, exportable log of all safety events                                                 |
| **History**           | Location and event history for user and compliance                                          |

### 📚 Shakti API Endpoints

#### SOS
- `POST   /api/sos/trigger` — Trigger SOS (OTP, location, contacts, audit)
- `POST   /api/sos/verify` — Verify OTP for SOS
- `POST   /api/trigger` — Trigger SOS with media (audio/photo)
- `POST   /api/:sosId/upload` — Upload media to SOS alert
- `POST   /api/:sosId/end` — End SOS (OTP required)

#### Emergency Contacts
- `POST   /emergency-contacts/` — Add a contact
- `GET    /emergency-contacts/` — List all contacts (personal + global)
- `PATCH  /emergency-contacts/:id` — Update a contact
- `DELETE /emergency-contacts/:id` — Delete a contact

#### Location Sharing
- `POST   /location/share` — Share current location with all contacts

#### Fake Call
- `POST   /fake-call/trigger` — Trigger a fake incoming call

#### Snatch Detection
- `POST   /snatch/report` — Report a snatch event (ML route prediction, notify contacts)

#### Safety Score
- `GET    /safety-score/` — Get current safety score and tips
- `POST   /safety-score/update` — Update safety score (delta)

#### Audit Log
- `GET    /audit-logs/` — Get all audit logs (filter by eventType, limit)

#### History
- `GET    /api/history/` — Get user location/event history

### 🗃️ Data Models (Key Fields)

**SOSAlert**
- `user`: User reference
- `location`: GeoJSON Point ([longitude, latitude])
- `status`: pending | active | resolved | cancelled
- `otp`, `otpExpires`: OTP for ending SOS
- `media`: [{ type: audio|video, url }]
- `resolvedAt`, `resolvedBy`, `createdAt`

**EmergencyContact**
- `user`: User reference (null for global)
- `name`, `phone`, `type`: personal | police | ambulance | fire | support | admin
- `country`, `city`, `isGlobal`, `createdAt`

**History**
- `userId`, `userName`, `startTime`, `endTime`, `locations` (array of { latitude, longitude, placeName, timestamp }), `isActive`

### 🔒 Security & Real-Time
- **JWT Auth**: All endpoints require authentication
- **Audit Log**: Every event is logged for compliance
- **Real-Time**: Socket.IO for instant notifications (SOS, snatch, etc.)
- **ML/AI**: Stubs for route prediction, safety score, and more
- **Extensible**: Modular controllers, easy to add new safety features

---

## 🚀 Features

| Category         | Features                                                                                       |
|------------------|-----------------------------------------------------------------------------------------------|
| **Core**         | CRUD for transactions, categories, budgets, goals; user & group finance; tags on transactions |
| **Collaboration**| Group accounts, approval workflow, granular permissions, comments, expense sharing            |
| **Automation**   | Recurring transactions/budgets, auto-categorization, ML/AI recommendations, tips              |
| **Analytics**    | Cash flow, trends, savings rate, net worth, over-budget, personalized tips, dashboard config  |
| **Notifications**| Real-time (Socket.IO), email, SMS, push (FCM), custom rules                                   |
| **Security**     | JWT auth, role-based access, 2FA (TOTP), GDPR endpoints, audit log, secure file upload        |
| **Integrations** | ML/AI microservices, currency conversion, bulk import/export, file upload, investment/loan stubs |
| **Docs**         | Swagger/OpenAPI, detailed README, usage notes, environment config                             |

---

## 📚 API Endpoints

### Categories
- `POST   /finance/category` — Create a new category
- `GET    /finance/categories` — List all categories for a user
- `PATCH  /finance/category/:id` — Edit a category
- `DELETE /finance/category/:id` — Delete a category

### Transactions
- `POST   /finance/transaction` — Add a new transaction (expense/income, tags, sharing, attachment, currency, recurring, split logic, permissions)
- `GET    /finance/transactions` — List/filter transactions (with pagination, tags, analytics)
- `PATCH  /finance/transaction/:id` — Edit a transaction
- `DELETE /finance/transaction/:id` — Delete a transaction
- `POST   /finance/transaction/:id/comment` — Add a comment to a transaction
- `POST   /finance/transaction/:id/approve` — Approve a group/shared transaction
- `POST   /finance/transaction/:id/reject` — Reject a group/shared transaction

### Budgets
- `POST   /finance/budget` — Set a budget (per category, per month, or overall, with currency, recurring, advanced recurrence)
- `GET    /finance/budgets` — List all budgets for a user
- `PATCH  /finance/budget/:id` — Edit a budget

### Goals
- `POST   /finance/goal` — Add a financial goal for a user
- `GET    /finance/goals` — List all goals for a user (with pagination)
- `PATCH  /finance/goal/:id` — Update a goal

### Analytics & Insights
- `GET    /finance/analytics/summary` — Get a summary of expenses/income (with currency conversion)
- `GET    /finance/analytics/overbudget` — Detect and list all over-budget categories/months (real-time notifications)
- `GET    /finance/analytics/recommendations` — Get personalized recommendations (ML/AI)
- `GET    /finance/analytics/trends` — Spending trends by category/period
- `GET    /finance/analytics/savings-rate` — Calculate savings rate
- `GET    /finance/analytics/net-worth` — Calculate net worth
- `GET    /finance/analytics/tax-estimation` — Estimate tax (simple model)

### Tags & Auto-categorization
- `POST   /finance/auto-categorize` — ML/NLP-based auto-categorization of transactions

### Personalized Tips
- `GET    /finance/personalized-tips` — Get rule-based or ML-driven financial tips

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

### Security & Compliance
- `POST   /finance/2fa/setup` — Setup 2FA (TOTP)
- `POST   /finance/2fa/verify` — Verify 2FA token
- `GET    /finance/gdpr/export` — Export all user finance data (GDPR)
- `DELETE /finance/gdpr/delete` — Delete all user finance data (GDPR)
- `GET    /finance/audit/export` — Export audit log

### Notifications
- `POST   /finance/notify/push` — Send a push notification (stub/FCM)
- `POST   /finance/notify/rule` — Set a custom notification rule

### Integrations & Stubs
- `GET    /finance/investments` — List investments (stub)
- `GET    /finance/loans` — List loans (stub)
- `GET    /finance/invoices` — List invoices (stub)
- `GET    /finance/payments` — List payments (stub)

---

## 🏷️ Tags & Badges
- **Tags:** Add arbitrary tags to transactions for flexible filtering and analytics.
- **Badges:** (Planned) Earn badges for financial milestones, savings streaks, and more.

---

## 🛡️ Security & Compliance
- **Authentication:** JWT-based, with optional 2FA (TOTP)
- **Authorization:** Role-based (user, group admin, member, viewer)
- **Audit Log:** All changes are logged for compliance
- **GDPR:** Export/delete all user finance data
- **File Uploads:** Secure, with ML/AI extraction

---

## ⚙️ Usage & Environment
- **Environment Variables:**
  - `JWT_SECRET` for authentication
  - `ML_RECOMMENDATION_URL`, `ML_DOC_EXTRACTION_URL` for ML/AI integration
  - `EMAIL_USER`, `EMAIL_PASS` for email notifications
  - `TWILIO_SID`, `TWILIO_TOKEN`, `TWILIO_NUMBER` for SMS notifications
- **Socket.IO:** Connect for real-time over-budget and approval notifications
- **Currency Conversion:** Uses [exchangerate-api.com](https://www.exchangerate-api.com/) for real-time rates
- **Bulk Import/Export:** Use `/finance/import` and `/finance/export` for CSV/JSON operations
- **Group Finance:** Only group members can access group endpoints; approval workflow and permissions enforced per group

---

## 📝 Documentation
- **Swagger/OpenAPI:** See [`backend2/swagger.yaml`](backend2/swagger.yaml) for full API docs
- **Codebase:** Modular, well-commented, and extensible for new features

---

## 🤝 Contributing
Contributions are welcome! Please open issues or pull requests for bug fixes, new features, or improvements. For major changes, please discuss with the maintainers first.

---

## 💬 Support
For support, open an issue on GitHub or contact the maintainers.

---

## 📄 License
This project is licensed under the MIT License. See [LICENSE](LICENSE) for details. 