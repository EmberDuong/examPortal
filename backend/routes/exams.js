const express = require('express');
const Exam = require('../models/Exam');
const Question = require('../models/Question');
const ExamAttempt = require('../models/ExamAttempt');
const { protect, adminOnly, activeOnly } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/exams
// @desc    Get all exams (admin sees all, students see available)
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        let query = {};

        // Students only see scheduled/ongoing exams
        if (req.user.role === 'student') {
            query.status = { $in: ['SCHEDULED', 'ONGOING'] };
        }

        const exams = await Exam.find(query)
            .populate('questions', 'text marks')
            .populate('createdBy', 'name')
            .sort({ createdAt: -1 });

        res.json(exams);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/exams/:id
// @desc    Get exam by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.id)
            .populate('questions')
            .populate('createdBy', 'name');

        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }

        // For students, hide correct answers
        if (req.user.role === 'student') {
            const sanitizedExam = exam.toObject();
            sanitizedExam.questions = sanitizedExam.questions.map(q => ({
                _id: q._id,
                text: q.text,
                description: q.description,
                options: q.options,
                marks: q.marks
                // correctOptionId is hidden
            }));
            return res.json(sanitizedExam);
        }

        res.json(exam);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/exams
// @desc    Create new exam
// @access  Admin
router.post('/', protect, adminOnly, async (req, res) => {
    try {
        const { title, code, department, instructor, durationMins, startDate, endDate, status, passScore, questions, thumbnailUrl } = req.body;

        // Calculate total marks
        let totalMarks = 0;
        if (questions && questions.length > 0) {
            const questionDocs = await Question.find({ _id: { $in: questions } });
            totalMarks = questionDocs.reduce((sum, q) => sum + q.marks, 0);
        }

        const exam = await Exam.create({
            title,
            code,
            department,
            instructor,
            durationMins,
            startDate,
            endDate,
            status,
            passScore,
            totalMarks,
            questions,
            thumbnailUrl: thumbnailUrl || `https://picsum.photos/seed/${code}/800/400`,
            createdBy: req.user._id
        });

        res.status(201).json(exam);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/exams/:id
// @desc    Update exam
// @access  Admin
router.put('/:id', protect, adminOnly, async (req, res) => {
    try {
        const { title, code, department, instructor, durationMins, startDate, endDate, status, passScore, questions, thumbnailUrl } = req.body;

        const exam = await Exam.findById(req.params.id);
        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }

        exam.title = title || exam.title;
        exam.code = code || exam.code;
        exam.department = department || exam.department;
        exam.instructor = instructor !== undefined ? instructor : exam.instructor;
        exam.durationMins = durationMins || exam.durationMins;
        exam.startDate = startDate || exam.startDate;
        exam.endDate = endDate || exam.endDate;
        exam.status = status || exam.status;
        exam.passScore = passScore || exam.passScore;
        exam.thumbnailUrl = thumbnailUrl || exam.thumbnailUrl;

        if (questions) {
            exam.questions = questions;
            const questionDocs = await Question.find({ _id: { $in: questions } });
            exam.totalMarks = questionDocs.reduce((sum, q) => sum + q.marks, 0);
        }

        const updatedExam = await exam.save();
        res.json(updatedExam);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

// @route   DELETE /api/exams/:id
// @desc    Delete exam
// @access  Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.id);
        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }

        await Exam.deleteOne({ _id: req.params.id });
        res.json({ message: 'Exam removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/exams/:id/start
// @desc    Start exam attempt
// @access  Student
router.post('/:id/start', protect, activeOnly, async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.id).populate('questions');
        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }

        if (exam.status !== 'ONGOING' && exam.status !== 'SCHEDULED') {
            return res.status(400).json({ message: 'Exam is not available' });
        }

        // Check if already has an in-progress attempt
        let attempt = await ExamAttempt.findOne({
            exam: req.params.id,
            student: req.user._id,
            status: 'IN_PROGRESS'
        });

        if (!attempt) {
            attempt = await ExamAttempt.create({
                exam: req.params.id,
                student: req.user._id,
                startedAt: new Date()
            });
        }

        // Sanitize questions (hide correct answers)
        const sanitizedQuestions = exam.questions.map(q => ({
            _id: q._id,
            text: q.text,
            description: q.description,
            options: q.options,
            marks: q.marks
        }));

        res.json({
            attempt: attempt,
            exam: {
                ...exam.toObject(),
                questions: sanitizedQuestions
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/exams/:id/submit
// @desc    Submit exam
// @access  Student
router.post('/:id/submit', protect, activeOnly, async (req, res) => {
    try {
        const { answers, autoSubmitted, violationsCount } = req.body;

        const attempt = await ExamAttempt.findOne({
            exam: req.params.id,
            student: req.user._id,
            status: 'IN_PROGRESS'
        });

        if (!attempt) {
            return res.status(404).json({ message: 'No active attempt found' });
        }

        // Calculate time taken
        const timeTaken = Math.floor((Date.now() - attempt.startedAt) / 1000);

        // Set answers
        attempt.answers = new Map(Object.entries(answers || {}));
        attempt.timeTaken = timeTaken;
        attempt.autoSubmitted = autoSubmitted || false;
        attempt.violationsCount = violationsCount || 0;
        attempt.submittedAt = new Date();
        attempt.status = 'SUBMITTED';

        await attempt.save();

        // Populate for response
        const populatedAttempt = await ExamAttempt.findById(attempt._id)
            .populate('exam')
            .populate('student', 'name email');

        res.json(populatedAttempt);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/exams/:id/save-answer
// @desc    Save single answer (auto-save)
// @access  Student
router.put('/:id/save-answer', protect, activeOnly, async (req, res) => {
    try {
        const { questionId, answerId } = req.body;

        const attempt = await ExamAttempt.findOne({
            exam: req.params.id,
            student: req.user._id,
            status: 'IN_PROGRESS'
        });

        if (!attempt) {
            return res.status(404).json({ message: 'No active attempt found' });
        }

        attempt.answers.set(questionId, answerId);
        await attempt.save();

        res.json({ message: 'Answer saved' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
