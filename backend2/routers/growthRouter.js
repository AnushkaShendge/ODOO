const express = require('express');
const router = express.Router();
const growthController = require('../controllers/growthController');

// --- Skills Matching ---
router.post('/match-skills', growthController.matchSkills);

// --- Forum ---
router.post('/forum/thread', growthController.createThread);
router.get('/forum/threads', growthController.getThreads);
router.post('/forum/post', growthController.createPost);
router.get('/forum/posts/:threadId', growthController.getPosts);
router.post('/forum/comment', growthController.createComment);
router.get('/forum/comments/:postId', growthController.getComments);

// --- Roadmap ---
router.post('/roadmap', growthController.createRoadmap);
router.get('/roadmaps', growthController.getRoadmaps);
router.patch('/roadmap/:id', growthController.updateRoadmap);

// --- Badges ---
router.post('/badge', growthController.awardBadge);
router.get('/badges', growthController.getBadges);

module.exports = router; 