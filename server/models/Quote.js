const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    company: { type: String },
    phone: { type: String },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    parameters: {
        length: { type: Number, required: true }, // Length in meters
        width: { type: Number, required: true }, // Width in mm
        loadCapacity: { type: Number, required: true }, // Load capacity in kg/m
        material: { type: String, required: true }, // e.g. Mild Steel, Stainless Steel
        speed: { type: Number } // m/min
    },
    calculatedCost: { type: Number, required: true },
    aiInsights: { type: String },
    status: { type: String, enum: ['Pending', 'Sent', 'Accepted', 'Rejected'], default: 'Pending' }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Quote', quoteSchema);
