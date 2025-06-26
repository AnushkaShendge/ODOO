const express = require('express');
const router = express.Router();
const learningController = require('../controllers/learningController');

// --- Courses ---
router.post('/course', learningController.createCourse);
router.get('/courses', learningController.getCourses);

// --- Enrollments ---
router.post('/enroll', learningController.enroll);
router.get('/enrollments', learningController.getEnrollments);
router.patch('/enrollment/:id', learningController.updateEnrollment);

// --- Dashboard ---
router.get('/dashboard', learningController.getDashboard);

module.exports = router; 