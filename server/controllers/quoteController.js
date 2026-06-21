const Quote = require('../models/Quote');
const Product = require('../models/Product');
const aiService = require('../services/aiService');

// Deterministic Pricing Logic Constants (in INR)
const MATERIAL_COST_PER_METER = {
    'Mild Steel': 36000, 
    'Stainless Steel (Food Grade)': 68000,
    'Aluminum': 48000
};

const WIDTH_MULTIPLIER = (width) => {
    if (width <= 300) return 1.0;
    if (width <= 600) return 1.25;
    if (width <= 1000) return 1.5;
    return 1.8;
};

const LOAD_MULTIPLIER = (load) => {
    if (load <= 50) return 1.0;
    if (load <= 200) return 1.2;
    if (load <= 500) return 1.4;
    return 1.7; // Heavy duty structural reinforcement needed
};

exports.generateQuote = async (req, res) => {
    try {
        const { customerName, customerEmail, company, phone, productId, parameters } = req.body;

        if (!customerName || !customerEmail || !productId || !parameters) {
            return res.status(400).json({ message: "Missing required fields." });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        // 1. Deterministic Calculation
        const { length, width, loadCapacity, material, speed } = parameters;
        
        let baseMaterialCost = MATERIAL_COST_PER_METER[material] || 36000;
        let costPerMeter = baseMaterialCost * WIDTH_MULTIPLIER(width) * LOAD_MULTIPLIER(loadCapacity);
        
        // Base system cost (motor, controller, terminals) = ₹1,20,000
        let baseSystemCost = 120000;
        // Motor upgrade for higher loads & speeds
        if (loadCapacity > 200 || speed > 30) baseSystemCost += 64000;

        let totalCalculatedCost = Math.round((costPerMeter * length) + baseSystemCost);

        // 2. AI Value-Add (Insights & Suggestions)
        // We pass the calculated cost and specs to the AI to get professional sales insights
        const aiInsights = await aiService.getQuoteInsights(product.name, parameters, totalCalculatedCost);

        // 3. Save Quote to DB
        const quote = new Quote({
            customerName,
            customerEmail,
            company,
            phone,
            productId,
            parameters,
            calculatedCost: totalCalculatedCost,
            aiInsights: aiInsights.reasoning
        });

        await quote.save();

        res.status(201).json({
            success: true,
            quote,
            productName: product.name
        });

    } catch (error) {
        console.error("Quote Generation Error:", error);
        res.status(500).json({ message: error.message || "Error generating quotation." });
    }
};

exports.getQuotes = async (req, res) => {
    try {
        const quotes = await Quote.find().populate('productId', 'name').sort({ createdAt: -1 });
        res.json({ success: true, quotes });
    } catch (error) {
        res.status(500).json({ message: "Error fetching quotes." });
    }
};
