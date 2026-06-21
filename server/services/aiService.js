const { GoogleGenAI } = require('@google/genai');
const prompts = require('./prompts');

// Initialize Gemini Client
// This uses the new Google GenAI SDK.
let ai;
try {
    if (process.env.GEMINI_API_KEY) {
        ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        console.log("Gemini AI Client initialized successfully.");
    } else {
        console.warn("GEMINI_API_KEY is not set in environment. AI features will fail.");
    }
} catch (error) {
    console.warn("Failed to initialize GoogleGenAI. AI features will fail.", error);
}

const getProductRecommendation = async (customerNeeds, productsList) => {
    if (!ai) throw new Error("AI Client not initialized. Please check GEMINI_API_KEY.");
    
    const prompt = prompts.productRecommendationPrompt(customerNeeds, productsList);
    
    try {
        const response = await ai.models.generateContent({
            model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });
        
        let responseText = response.text;
        
        // Strip markdown if the LLM accidentally added it despite instructions
        if (responseText.startsWith('```json')) {
            responseText = responseText.substring(7, responseText.length - 3).trim();
        } else if (responseText.startsWith('```')) {
            responseText = responseText.substring(3, responseText.length - 3).trim();
        }

        return JSON.parse(responseText);
    } catch (error) {
        console.error("AI Recommendation Error:", error);
        throw new Error("Failed to generate recommendation from AI.");
    }
};

const getSemanticSearchResults = async (searchQuery, productsList, language) => {
    if (!ai) throw new Error("AI Client not initialized. Please check GEMINI_API_KEY.");
    
    const prompt = prompts.semanticSearchPrompt(searchQuery, productsList, language);
    
    try {
        const response = await ai.models.generateContent({
            model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });
        
        let responseText = response.text;
        
        if (responseText.startsWith('\`\`\`json')) {
            responseText = responseText.substring(7, responseText.length - 3).trim();
        } else if (responseText.startsWith('\`\`\`')) {
            responseText = responseText.substring(3, responseText.length - 3).trim();
        }

        return JSON.parse(responseText);
    } catch (error) {
        console.error("AI Semantic Search Error:", error);
        throw new Error("Failed to generate semantic search results from AI.");
    }
};

const getQuoteInsights = async (productName, parameters, totalCalculatedCost) => {
    if (!ai) return { reasoning: "Standard industrial grade quotation." }; // Fallback if AI not setup
    
    const prompt = prompts.quoteInsightsPrompt(productName, parameters, totalCalculatedCost);
    
    try {
        const response = await ai.models.generateContent({
            model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });
        
        let responseText = response.text;
        
        if (responseText.startsWith('\`\`\`json')) {
            responseText = responseText.substring(7, responseText.length - 3).trim();
        } else if (responseText.startsWith('\`\`\`')) {
            responseText = responseText.substring(3, responseText.length - 3).trim();
        }

        return JSON.parse(responseText);
    } catch (error) {
        console.error("AI Quote Insights Error:", error);
        return { reasoning: "This quotation is based on the selected specifications. Contact our engineering team for further optimization." };
    }
};

const generateProposalText = async (productName, shortDesc, roiData, customerName, company) => {
    if (!ai) return { 
        executiveSummary: "Standard industrial grade proposal.",
        technicalSolution: "Our systems ensure robust operations.",
        financialImpact: "Expect a fast return on your investment."
    }; 
    
    const prompt = prompts.proposalPrompt(productName, shortDesc, roiData, customerName, company);
    
    try {
        const response = await ai.models.generateContent({
            model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });
        
        let responseText = response.text;
        
        if (responseText.startsWith('\`\`\`json')) {
            responseText = responseText.substring(7, responseText.length - 3).trim();
        } else if (responseText.startsWith('\`\`\`')) {
            responseText = responseText.substring(3, responseText.length - 3).trim();
        }

        return JSON.parse(responseText);
    } catch (error) {
        console.error("AI Proposal Generation Error:", error);
        return { 
            executiveSummary: "Thank you for considering Autocon Solutions.",
            technicalSolution: "Our team will design a system tailored to your needs.",
            financialImpact: "This system will significantly reduce manual labor costs."
        };
    }
};

module.exports = {
    getProductRecommendation,
    getSemanticSearchResults,
    getQuoteInsights,
    generateProposalText
};
