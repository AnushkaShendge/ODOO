import AuditLog from '../model/auditLog.js';

export const logEvent = async (user, eventType, eventRef, details) => {
  try {
    await AuditLog.create({ user, eventType, eventRef, details });
  } catch (err) {
    // Optionally log error
  }
};

export const getAuditLogs = async (req, res) => {
  try {
    const user = req.user ? req.user.id : null;
    const { eventType, limit = 50 } = req.query;
    const filter = user ? { user } : {};
    if (eventType) filter.eventType = eventType;
    const logs = await AuditLog.find(filter).sort({ createdAt: -1 }).limit(Number(limit));
    res.json({ success: true, logs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 