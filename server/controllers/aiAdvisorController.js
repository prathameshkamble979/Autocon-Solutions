const Product = require('../models/Product');
const aiService = require('../services/aiService');

exports.getRecommendation = async (req, res) => {
    try {
        const { industry, productType, material, weightCapacity, conveyorLength, environment, foodGrade, automation } = req.body;

        // Step 1: Query MongoDB to filter products
        // We use deterministic filtering to reduce the dataset sent to the AI
        let query = {};
        
        // Example deterministic filter:
        if (foodGrade === 'Yes') {
            query.$or = [
                { 'features': { $regex: 'food', $options: 'i' } },
                { 'description': { $regex: 'food', $options: 'i' } },
                { 'applications': { $regex: 'food', $options: 'i' } },
                { 'name': { $regex: 'food|ss|stainless', $options: 'i' } }
            ];
        }

        if (industry) {
            // Check if industry matches applications or description loosely
            query.$or = query.$or || [];
            query.$or.push({ 'applications': { $regex: industry, $options: 'i' } });
            query.$or.push({ 'description': { $regex: industry, $options: 'i' } });
        }

        // Fetch a small, highly relevant subset of products
        // Limit to top 20 to save context window and processing time
        const products = await Product.find(query)
            .limit(20)
            .select('_id name shortDesc description category subcategory features specifications applications');

        // If strict filtering yields nothing, fallback to fetching all products (or a reasonable limit)
        let shortlist = products;
        if (!shortlist || shortlist.length === 0) {
            shortlist = await Product.find().limit(50).select('_id name shortDesc description category subcategory features specifications applications');
        }

        // Step 2: Prepare data for AI
        const customerNeeds = { industry, productType, material, weightCapacity, conveyorLength, environment, foodGrade, automation };
        
        // Step 3: Call AI Service to make the final recommendation
        const aiResponse = await aiService.getProductRecommendation(customerNeeds, shortlist);

        if (!aiResponse.recommendedProductId) {
            return res.json({ 
                success: true, 
                recommendation: {
                    product: null,
                    message: aiResponse.reason
                }
            });
        }

        // Step 4: Fetch full product details for the recommended product to return to the frontend
        const recommendedProduct = await Product.findById(aiResponse.recommendedProductId);

        res.json({
            success: true,
            recommendation: {
                product: recommendedProduct,
                reason: aiResponse.reason,
                advantages: aiResponse.advantages
            }
        });

    } catch (error) {
        console.error("Advisor Error:", error);
        res.status(500).json({ message: error.message || "Error generating recommendation. Please try again." });
    }
};
