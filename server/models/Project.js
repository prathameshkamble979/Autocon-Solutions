
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    images: [{
        type: String,
    }],
    status: {
        type: String,
        enum: ['Ongoing', 'Completed'],
        default: 'Ongoing',
    },
    completedAt: {
        type: Date,
    },

}, {
    timestamps: true,
});

module.exports = mongoose.model('Project', projectSchema);
