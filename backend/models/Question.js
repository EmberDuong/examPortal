const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    options: [{
        id: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true
        }
    }],
    correctOptionId: {
        type: String,
        required: true
    },
    marks: {
        type: Number,
        required: true,
        default: 5
    },
    explanation: {
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

module.exports = mongoose.model('Question', questionSchema);
