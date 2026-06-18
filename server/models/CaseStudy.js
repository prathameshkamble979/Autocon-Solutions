const mongoose = require('mongoose');

const caseStudySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        lowercase: true,
    },
    client: {
        type: String,
    },
    industry: {
        type: String,
        required: true,
    },
    location: {
        type: String,
    },
    mainImage: {
        type: String,
        required: true,
    },
    images: [{
        type: String, // Gallery of project images
    }],
    problem: {
        type: String,
        required: true,
    },
    solution: {
        type: String,
        required: true,
    },
    results: [{
        type: String, // Array of bullet points
    }],
    stats: [{
        label: String,
        value: String,
    }],
    featured: {
        type: Boolean,
        default: false,
    },
    date: {
        type: Date,
        default: Date.now,
    },

}, {
    timestamps: true,
});

caseStudySchema.index({ slug: 1 }, { unique: true });

module.exports = mongoose.model('CaseStudy', caseStudySchema);
