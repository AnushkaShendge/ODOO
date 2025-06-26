const User = require('../models/user');
const ForumThread = require('../models/forumThread');
const ForumPost = require('../models/forumPost');
const ForumComment = require('../models/forumComment');
const Roadmap = require('../models/roadmap');
const Badge = require('../models/badge');

// --- Skills Matching (stub logic) ---
exports.matchSkills = async (req, res) => {
  try {
    const { userId, skills } = req.body;
    if (!userId || !skills || !Array.isArray(skills)) return res.status(400).json({ error: 'userId and skills[] required' });
    // Find users with overlapping skills (stub: top 5)
    const matches = await User.find({ skills: { $in: skills }, _id: { $ne: userId } }).limit(5);
    res.json({ success: true, matches });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// --- Forum ---
exports.createThread = async (req, res) => {
  try {
    const { userId, title, description } = req.body;
    if (!userId || !title) return res.status(400).json({ error: 'userId and title required' });
    const thread = await ForumThread.create({ user: userId, title, description });
    res.status(201).json({ success: true, thread });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
exports.getThreads = async (req, res) => {
  try {
    const threads = await ForumThread.find().populate('user');
    res.json({ success: true, threads });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
exports.createPost = async (req, res) => {
  try {
    const { threadId, userId, content } = req.body;
    if (!threadId || !userId || !content) return res.status(400).json({ error: 'threadId, userId, content required' });
    const post = await ForumPost.create({ thread: threadId, user: userId, content });
    res.status(201).json({ success: true, post });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
exports.getPosts = async (req, res) => {
  try {
    const { threadId } = req.params;
    const posts = await ForumPost.find({ thread: threadId }).populate('user');
    res.json({ success: true, posts });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
exports.createComment = async (req, res) => {
  try {
    const { postId, userId, content } = req.body;
    if (!postId || !userId || !content) return res.status(400).json({ error: 'postId, userId, content required' });
    const comment = await ForumComment.create({ post: postId, user: userId, content });
    res.status(201).json({ success: true, comment });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
exports.getComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await ForumComment.find({ post: postId }).populate('user');
    res.json({ success: true, comments });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// --- Roadmap ---
exports.createRoadmap = async (req, res) => {
  try {
    const { userId, title, steps } = req.body;
    if (!userId || !title || !Array.isArray(steps)) return res.status(400).json({ error: 'userId, title, steps[] required' });
    const roadmap = await Roadmap.create({ user: userId, title, steps });
    res.status(201).json({ success: true, roadmap });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
exports.getRoadmaps = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    const roadmaps = await Roadmap.find({ user: userId });
    res.json({ success: true, roadmaps });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
exports.updateRoadmap = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const roadmap = await Roadmap.findByIdAndUpdate(id, update, { new: true });
    res.json({ success: true, roadmap });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// --- Badges ---
exports.awardBadge = async (req, res) => {
  try {
    const { userId, name, description, criteria } = req.body;
    if (!userId || !name) return res.status(400).json({ error: 'userId and name required' });
    const badge = await Badge.create({ user: userId, name, description, criteria });
    res.status(201).json({ success: true, badge });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
exports.getBadges = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    const badges = await Badge.find({ user: userId });
    res.json({ success: true, badges });
  } catch (err) { res.status(500).json({ error: err.message }); }
}; 