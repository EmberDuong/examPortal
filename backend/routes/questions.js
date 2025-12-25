const express = require('express');
const Question = require('../models/Question');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/questions
// @desc    Get all questions
// @access  Admin
router.get('/', protect, adminOnly, async (req, res) => {
    try {
        const questions = await Question.find()
            .populate('createdBy', 'name')
            .sort({ createdAt: -1 });
        res.json(questions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/questions/:id
// @desc    Get question by ID
// @access  Admin
router.get('/:id', protect, adminOnly, async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }
        res.json(question);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/questions
// @desc    Create new question
// @access  Admin
router.post('/', protect, adminOnly, async (req, res) => {
    try {
        const { text, description, options, correctOptionId, marks, explanation } = req.body;

        const question = await Question.create({
            text,
            description,
            options,
            correctOptionId,
            marks,
            explanation,
            createdBy: req.user._id
        });

        res.status(201).json(question);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/questions/:id
// @desc    Update question
// @access  Admin
router.put('/:id', protect, adminOnly, async (req, res) => {
    try {
        const { text, description, options, correctOptionId, marks, explanation } = req.body;

        const question = await Question.findById(req.params.id);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        question.text = text || question.text;
        question.description = description !== undefined ? description : question.description;
        question.options = options || question.options;
        question.correctOptionId = correctOptionId || question.correctOptionId;
        question.marks = marks || question.marks;
        question.explanation = explanation !== undefined ? explanation : question.explanation;

        const updatedQuestion = await question.save();
        res.json(updatedQuestion);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

// @route   DELETE /api/questions/:id
// @desc    Delete question
// @access  Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        await Question.deleteOne({ _id: req.params.id });
        res.json({ message: 'Question removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
