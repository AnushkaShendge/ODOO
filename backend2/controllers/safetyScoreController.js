const SafetyScore = require('../models/safetyScore');

// Get user's safety score
exports.getSafetyScore = async (req, res) => {
  try {
    const { userId } = req.params;
    const score = await SafetyScore.findOne({ user: userId });
    if (!score) return res.status(404).json({ error: 'Safety score not found' });
    res.json({ success: true, score });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update user's safety score (add change and reason to history)
exports.updateSafetyScore = async (req, res) => {
  try {
    const { userId } = req.params;
    const { change, reason } = req.body;
    if (typeof change !== 'number' || !reason) {
      return res.status(400).json({ error: 'Change (number) and reason are required' });
    }
    let score = await SafetyScore.findOne({ user: userId });
    if (!score) {
      score = await SafetyScore.create({ user: userId, score: 100 });
    }
    score.score += change;
    score.history.push({ change, reason });
    await score.save();
    res.json({ success: true, score });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Reset user's safety score
exports.resetSafetyScore = async (req, res) => {
  try {
    const { userId } = req.params;
    const score = await SafetyScore.findOneAndUpdate(
      { user: userId },
      { score: 100, history: [] },
      { new: true }
    );
    if (!score) return res.status(404).json({ error: 'Safety score not found' });
    res.json({ success: true, score });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 