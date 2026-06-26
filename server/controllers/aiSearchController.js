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
        let products = await Product.find()
            .limit(50) // Adjust if catalog grows significantly
            .select('_id name shortDesc category subcategory features applications');

        // Fallback static catalog for the AI to search if the database is empty or missing demo products.
        const staticCatalog = [
            { _id: 'd1', name: 'Flat Belt Conveyor', shortDesc: 'Standard flat belt conveyor for horizontal material transport.', category: 'Conveyors' },
            { _id: 'd2', name: 'Inclined Belt Conveyor', shortDesc: 'Steep angle inclined belt conveyor for elevating materials.', category: 'Conveyors' },
            { _id: 'd3', name: 'Cleated Belt Conveyor', shortDesc: 'Belt conveyor with cleats for preventing rollback.', category: 'Conveyors' },
            { _id: 'd4', slug: 'heavy-duty-belt-conveyor', name: 'Heavy Duty Belt Conveyor', shortDesc: 'Reinforced frame belt conveyor for loads up to 2000 kg/m.', category: 'Conveyors' },
            { _id: 'd7', slug: 'heavy-duty-chain-conveyor', name: 'Heavy Duty Chain Conveyor', shortDesc: 'Robust dual-strand chain conveyor for moving heavy loads.', category: 'Conveyors' },
            { _id: 'c1', slug: 'belt-conveyors', name: 'Belt Conveyors', shortDesc: 'Versatile and efficient conveying systems ideal for general material handling.', category: 'Conveyors' },
            { _id: 'c2', slug: 'roller-conveyors', name: 'Roller Conveyors', shortDesc: 'Gravity and motorized roller systems for fast, reliable product flow.', category: 'Conveyors' },
            { _id: 'c3', slug: 'chain-conveyors', name: 'Chain Conveyors', shortDesc: 'Heavy-duty chain systems designed for transporting heavy loads.', category: 'Conveyors' }
        ];

        // Merge DB products with static catalog (avoiding duplicates if possible)
        const dbProductNames = products.map(p => p.name);
        const missingStaticProducts = staticCatalog.filter(sp => !dbProductNames.includes(sp.name));
        products = [...products, ...missingStaticProducts];

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
        
        // Filter out valid ObjectIds to avoid Mongoose CastError on static IDs like 'd4'
        const mongoose = require('mongoose');
        const validObjectIds = matchedProductIds.filter(id => mongoose.Types.ObjectId.isValid(id) && String(id).length === 24);
        
        // Fetch full product details but preserve the AI's ranked order
        const matchedProducts = await Product.find({ _id: { $in: validObjectIds } });
        
        // Sort the matched products based on the order returned by the AI
        // Merge with static catalog if the ID is from the static catalog
        const sortedProducts = matchedProductIds.map(id => {
            let p = matchedProducts.find(p => p._id.toString() === id.toString());
            if (!p) p = staticCatalog.find(sp => sp._id === id || sp.slug === id);
            return p;
        }).filter(Boolean); // Remove any undefined if a product was deleted in the meantime

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
