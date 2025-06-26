const Course = require('../models/course');
const Enrollment = require('../models/enrollment');

// --- Courses ---
exports.createCourse = async (req, res) => {
  try {
    const { title, description, content } = req.body;
    if (!title || !Array.isArray(content)) return res.status(400).json({ error: 'title and content[] required' });
    const course = await Course.create({ title, description, content });
    res.status(201).json({ success: true, course });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json({ success: true, courses });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// --- Enrollments ---
exports.enroll = async (req, res) => {
  try {
    const { userId, courseId } = req.body;
    if (!userId || !courseId) return res.status(400).json({ error: 'userId and courseId required' });
    let enrollment = await Enrollment.findOne({ user: userId, course: courseId });
    if (!enrollment) {
      enrollment = await Enrollment.create({ user: userId, course: courseId });
    }
    res.status(201).json({ success: true, enrollment });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
exports.getEnrollments = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    const enrollments = await Enrollment.find({ user: userId }).populate('course');
    res.json({ success: true, enrollments });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
exports.updateEnrollment = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const enrollment = await Enrollment.findByIdAndUpdate(id, update, { new: true });
    res.json({ success: true, enrollment });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// --- Dashboard ---
exports.getDashboard = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    const enrollments = await Enrollment.find({ user: userId }).populate('course');
    const dashboard = enrollments.map(e => ({
      course: e.course.title,
      progress: e.progress.length,
      totalLessons: e.course.content.length,
      completed: e.completed
    }));
    res.json({ success: true, dashboard });
  } catch (err) { res.status(500).json({ error: err.message }); }
}; 