import { logEvent } from './auditLogController.js';

let userScores = {};

export const getSafetyScore = async (req, res) => {
  try {
    const user = req.user.id;
    const score = userScores[user] || 50;
    // TODO: Calculate based on real usage
    const tips = [
      'Share your location regularly with trusted contacts.',
      'Set up emergency contacts for quick access.',
      'Test the SOS system monthly.'
    ];
    // TODO: Add gamification (badges, streaks)
    await logEvent(user, 'SAFETY_SCORE', null, { score });
    res.json({ success: true, score, tips });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const updateSafetyScore = async (req, res) => {
  try {
    const user = req.user.id;
    const { delta } = req.body;
    userScores[user] = (userScores[user] || 50) + delta;
    await logEvent(user, 'SAFETY_SCORE', null, { score: userScores[user] });
    res.json({ success: true, score: userScores[user] });
  } catch (err) { res.status(500).json({ error: err.message }); }
}; 