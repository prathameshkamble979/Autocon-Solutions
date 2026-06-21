const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    company: { type: String },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    roiData: {
        systemCost: Number,
        workersReplaced: Number,
        monthlySavings: Number,
        paybackPeriod: Number
    },
    aiProposalText: {
        executiveSummary: String,
        technicalSolution: String,
        financialImpact: String
    },
    status: { type: String, enum: ['Draft', 'Sent', 'Signed', 'Declined'], default: 'Draft' }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Proposal', proposalSchema);
