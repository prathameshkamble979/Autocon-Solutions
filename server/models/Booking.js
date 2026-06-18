
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['VISIT', 'PRODUCT', 'ENQUIRY', 'GENERAL', 'CONTACT', 'PROJECT'],
        default: 'ENQUIRY',
    },
    source: {
        type: String,
        default: 'Website',
    },
    name: {
        type: String,
        required: true,
    },
    company: {
        type: String,
    },
    phone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    product: {
        type: String,
    },
    preferredDate: {
        type: Date,
    },
    quantity: {
        type: Number,
    },
    message: {
        type: String,
    },
    industry: {
        type: String,
    },
    budget: {
        type: String,
    },
    timeline: {
        type: String,
    },
    drawing: {
        type: String, // URL to uploaded file
    },
    status: {
        type: String,
        enum: ['NEW', 'ACCEPTED', 'REJECTED', 'CONTACTED', 'CLOSED', 'PENDING'],
        default: 'PENDING',
    },
    priority: {
        type: String,
        enum: ['LOW', 'MEDIUM', 'HIGH'],
        default: 'MEDIUM'
    },
    requirementType: {
        type: String,
        enum: ['NEW', 'UPGRADE', 'REPAIR'],
    },
    isDuplicate: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true,
});

module.exports = mongoose.model('Booking', bookingSchema);
