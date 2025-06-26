import { logEvent } from './auditLogController.js';
import EmergencyContact from '../model/emergency-contact.js';

export const reportSnatch = async (req, res) => {
  try {
    const user = req.user.id;
    const { lastLocation } = req.body;
    // TODO: ML route prediction stub
    const predictedRoutes = [
      [lastLocation], [lastLocation], [lastLocation], [lastLocation], [lastLocation]
    ];
    // Notify guardians (stub)
    const contacts = await EmergencyContact.find({ $or: [{ user }, { isGlobal: true }] });
    contacts.forEach(c => { /* send SMS/email with lastLocation and predictedRoutes */ });
    await logEvent(user, 'SNATCH', null, { lastLocation, predictedRoutes });
    res.json({ success: true, predictedRoutes });
  } catch (err) { res.status(500).json({ error: err.message }); }
}; 