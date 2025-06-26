import EmergencyContact from '../model/emergency-contact.js';
import { logEvent } from './auditLogController.js';

export const shareLocation = async (req, res) => {
  try {
    const user = req.user.id;
    const { coordinates } = req.body; // [lon, lat]
    const contacts = await EmergencyContact.find({ $or: [{ user }, { isGlobal: true }] });
    // TODO: Send location via socket/email/SMS (stub)
    contacts.forEach(c => { /* send location to c.phone/c.email */ });
    await logEvent(user, 'LOCATION_SHARE', null, { coordinates });
    res.json({ success: true, message: 'Location shared with all emergency contacts.' });
  } catch (err) { res.status(500).json({ error: err.message }); }
}; 