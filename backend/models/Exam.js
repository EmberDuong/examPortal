const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },
    department: {
        type: String,
        required: true
    },
    instructor: {
        type: String,
        default: ''
    },
    durationMins: {
        type: Number,
        required: true,
        default: 60
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ['DRAFT', 'SCHEDULED', 'ONGOING', 'CLOSED'],
        default: 'DRAFT'
    },
    passScore: {
        type: Number,
        default: 60
    },
    totalMarks: {
        type: Number,
        default: 0
    },
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
    }],
    thumbnailUrl: {
        type: String,
        default: ''
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Calculate total marks before saving
examSchema.pre('save', async function (next) {
    if (this.isModified('questions')) {
        const Question = mongoose.model('Question');
        const questions = await Question.find({ _id: { $in: this.questions } });
        this.totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);
    }
    next();
});

module.exports = mongoose.model('Exam', examSchema);
