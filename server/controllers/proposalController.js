const Proposal = require('../models/Proposal');
const Product = require('../models/Product');
const aiService = require('../services/aiService');

exports.generateProposal = async (req, res) => {
    try {
        const { customerName, customerEmail, company, productId, roiData } = req.body;

        if (!customerName || !productId || !roiData) {
            return res.status(400).json({ message: "Missing required fields." });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        // Generate the Professional Proposal Text using Gemini
        const aiProposalText = await aiService.generateProposalText(
            product.name,
            product.shortDesc,
            roiData,
            customerName,
            company
        );

        // Save to Database
        const proposal = new Proposal({
            customerName,
            customerEmail,
            company,
            productId,
            roiData,
            aiProposalText
        });

        await proposal.save();

        res.status(201).json({
            success: true,
            proposal,
            productName: product.name
        });

    } catch (error) {
        console.error("Proposal Generation Error:", error);
        res.status(500).json({ message: error.message || "Error generating proposal." });
    }
};

exports.getProposals = async (req, res) => {
    try {
        const proposals = await Proposal.find().populate('productId', 'name').sort({ createdAt: -1 });
        res.json({ success: true, proposals });
    } catch (error) {
        res.status(500).json({ message: "Error fetching proposals." });
    }
};
