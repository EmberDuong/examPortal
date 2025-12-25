const express = require('express');
const ExamAttempt = require('../models/ExamAttempt');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/results
// @desc    Submit exam result (student)
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { exam, answers, score, totalMarks, timeTaken, autoSubmitted, violationsCount, startedAt, submittedAt } = req.body;

        // Check if student already submitted this exam
        const existingAttempt = await ExamAttempt.findOne({
            exam: exam,
            student: req.user._id,
            status: 'SUBMITTED'
        });

        if (existingAttempt) {
            return res.status(400).json({ message: 'You have already submitted this exam' });
        }

        // Create new exam attempt
        const examAttempt = new ExamAttempt({
            exam,
            student: req.user._id,
            answers: answers || {},
            score: score || 0,
            totalMarks: totalMarks || 0,
            timeTaken: timeTaken || 0,
            autoSubmitted: autoSubmitted || false,
            violationsCount: violationsCount || 0,
            startedAt: startedAt ? new Date(startedAt) : new Date(),
            submittedAt: submittedAt ? new Date(submittedAt) : new Date(),
            status: 'SUBMITTED'
        });

        await examAttempt.save();

        res.status(201).json({
            message: 'Exam submitted successfully',
            result: examAttempt
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/results
// @desc    Get all results (admin)
// @access  Admin
router.get('/', protect, adminOnly, async (req, res) => {
    try {
        const results = await ExamAttempt.find({ status: 'SUBMITTED' })
            .populate('exam', 'title code totalMarks passScore')
            .populate('student', 'name email avatar')
            .sort({ submittedAt: -1 });
        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/results/check/:examId
// @desc    Check if student has submitted an exam
// @access  Private
router.get('/check/:examId', protect, async (req, res) => {
    try {
        const attempt = await ExamAttempt.findOne({
            exam: req.params.examId,
            student: req.user._id,
            status: 'SUBMITTED'
        }).populate('exam', 'title');

        if (attempt) {
            res.json({
                hasSubmitted: true,
                attemptId: attempt._id,
                score: attempt.score,
                submittedAt: attempt.submittedAt
            });
        } else {
            res.json({ hasSubmitted: false });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/results/my
// @desc    Get my results (student)
// @access  Private
router.get('/my', protect, async (req, res) => {
    try {
        const results = await ExamAttempt.find({
            student: req.user._id,
            status: 'SUBMITTED'
        })
            .populate('exam', 'title code totalMarks passScore')
            .sort({ submittedAt: -1 });
        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/results/:id
// @desc    Get result by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const result = await ExamAttempt.findById(req.params.id)
            .populate({
                path: 'exam',
                populate: { path: 'questions' }
            })
            .populate('student', 'name email avatar');

        if (!result) {
            return res.status(404).json({ message: 'Result not found' });
        }

        // Students can only see their own results
        if (req.user.role === 'student' && result.student._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/results/exam/:examId
// @desc    Get all results for an exam (admin)
// @access  Admin
router.get('/exam/:examId', protect, adminOnly, async (req, res) => {
    try {
        const results = await ExamAttempt.find({
            exam: req.params.examId,
            status: 'SUBMITTED'
        })
            .populate('student', 'name email avatar')
            .sort({ score: -1 });
        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/results/stats
// @desc    Get overall stats (admin)
// @access  Admin
router.get('/stats/overview', protect, adminOnly, async (req, res) => {
    try {
        const totalSubmissions = await ExamAttempt.countDocuments({ status: 'SUBMITTED' });

        const avgScore = await ExamAttempt.aggregate([
            { $match: { status: 'SUBMITTED' } },
            { $group: { _id: null, avgScore: { $avg: '$score' } } }
        ]);

        res.json({
            totalSubmissions,
            avgScore: avgScore[0]?.avgScore || 0
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
