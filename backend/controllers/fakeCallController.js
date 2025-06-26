import { logEvent } from './auditLogController.js';

export const triggerFakeCall = async (req, res) => {
  try {
    const user = req.user.id;
    const { audioUrl } = req.body;
    // TODO: Schedule/trigger fake call on device (stub)
    await logEvent(user, 'FAKE_CALL', null, { audioUrl });
    res.json({ success: true, message: 'Fake call triggered.' });
  } catch (err) { res.status(500).json({ error: err.message }); }
}; 