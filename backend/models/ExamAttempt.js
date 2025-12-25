const mongoose = require('mongoose');

const examAttemptSchema = new mongoose.Schema({
    exam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exam',
        required: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    answers: {
        type: Map,
        of: String,
        default: {}
    },
    score: {
        type: Number,
        default: 0
    },
    startedAt: {
        type: Date,
        default: Date.now
    },
    submittedAt: {
        type: Date
    },
    timeTaken: {
        type: Number, // in seconds
        default: 0
    },
    autoSubmitted: {
        type: Boolean,
        default: false
    },
    violationsCount: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['IN_PROGRESS', 'SUBMITTED'],
        default: 'IN_PROGRESS'
    }
}, {
    timestamps: true
});

// Calculate score before saving when submitted
examAttemptSchema.pre('save', async function (next) {
    if (this.isModified('status') && this.status === 'SUBMITTED') {
        const Exam = mongoose.model('Exam');
        const Question = mongoose.model('Question');

        const exam = await Exam.findById(this.exam).populate('questions');
        if (exam) {
            let score = 0;
            for (const question of exam.questions) {
                const userAnswer = this.answers.get(question._id.toString());
                if (userAnswer === question.correctOptionId) {
                    score += question.marks;
                }
            }
            this.score = score;
        }
    }
    next();
});

module.exports = mongoose.model('ExamAttempt', examAttemptSchema);
