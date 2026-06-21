const Product = require('../models/Product');
const aiService = require('../services/aiService');

exports.semanticSearch = async (req, res) => {
    try {
        const { query, language = 'en-US' } = req.body;

        if (!query) {
            return res.status(400).json({ message: "Search query is required." });
        }

        // Fetch the active products from DB to send to AI.
        // We only select the necessary fields to keep the token size lightweight.
        const products = await Product.find()
            .limit(50) // Adjust if catalog grows significantly
            .select('_id name shortDesc category subcategory features applications');

        if (!products || products.length === 0) {
            return res.status(404).json({ message: "No products found in the database." });
        }

        // Call AI Service to understand intent and rank products
        const aiResponse = await aiService.getSemanticSearchResults(query, products, language);

        if (!aiResponse.results || aiResponse.results.length === 0) {
            return res.json({ 
                success: true, 
                results: [],
                speechSummary: aiResponse.speechSummary || "No products found."
            });
        }

        // Map AI result IDs back to full product objects to return to the frontend
        const matchedProductIds = aiResponse.results.map(r => r.productId);
        
        // Fetch full product details but preserve the AI's ranked order
        const matchedProducts = await Product.find({ _id: { $in: matchedProductIds } });
        
        // Sort the matched products based on the order returned by the AI
        const sortedProducts = matchedProductIds.map(id => 
            matchedProducts.find(p => p._id.toString() === id.toString())
        ).filter(Boolean); // Remove any undefined if a product was deleted in the meantime

        res.json({
            success: true,
            results: sortedProducts,
            aiReasoning: aiResponse.results,
            speechSummary: aiResponse.speechSummary
        });

    } catch (error) {
        console.error("Semantic Search Error:", error);
        res.status(500).json({ message: error.message || "Error performing semantic search." });
    }
};
