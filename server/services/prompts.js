module.exports = {
    productRecommendationPrompt: (customerNeeds, productsList) => `
You are an expert Industrial Solutions Advisor working for Autocon Solutions.
The customer has the following requirements for an industrial conveyor or solution:
${JSON.stringify(customerNeeds, null, 2)}

Here is a shortlisted catalog of available products from our database:
${JSON.stringify(productsList, null, 2)}

Your task is to select the BEST matching product from the catalog for the customer's needs.
You MUST return your answer in valid JSON format exactly as follows, with no markdown formatting around it (do not use \`\`\`json blocks, just the raw JSON):

{
  "recommendedProductId": "String ID of the selected product (the _id field)",
  "reason": "A professional paragraph explaining why this is the perfect fit.",
  "advantages": ["Point 1", "Point 2", "Point 3"]
}

If absolutely no product fits, return:
{
  "recommendedProductId": null,
  "reason": "Sorry, based on your criteria, we do not have a suitable product in our catalog.",
  "advantages": []
}
`,
    semanticSearchPrompt: (searchQuery, productsList, language = 'en-US') => `
You are an intelligent search engine for Autocon Solutions.
A user has searched for: "${searchQuery}"
The user's preferred language code is: "${language}"

Here is the current product catalog:
${JSON.stringify(productsList, null, 2)}

Your task is to understand the user's natural language intent and find the products that match their needs.
You MUST translate your reasoning into the language specified by the language code (${language}).
You MUST return your answer in valid JSON format exactly as follows, with no markdown formatting around it:

{
  "results": [
    {
      "productId": "String ID of the product",
      "reason": "One sentence explaining why it matches (Translated into the requested language)"
    }
  ],
  "speechSummary": "A very brief 1-2 sentence spoken summary of the results (e.g. 'I found 3 products. The top match is X because Y.') translated into the requested language."
}

Only include products that are genuinely relevant. If no products are relevant, return an empty array for results, and a polite speechSummary in the requested language explaining no products were found.
`,
    quoteInsightsPrompt: (productName, parameters, totalCalculatedCost) => `
You are an expert sales engineer for Autocon Solutions.
A customer has requested a price quote for a custom "${productName}".
The deterministic pricing engine has calculated the total cost to be ₹${totalCalculatedCost}.

Here are the customer's custom parameters:
${JSON.stringify(parameters, null, 2)}

Your task is to provide professional, persuasive "AI Insights" that will be displayed alongside the quote. 
Explain briefly why the cost is justified (e.g., highlighting the durability of Stainless Steel, or the power of the motor required for high load capacity).
Suggest one potential cost-saving alternative if applicable (e.g., "If you reduce the speed slightly, you could save on motor costs").

Return ONLY a valid JSON object exactly as follows, with no markdown formatting around it:
{
  "reasoning": "Your persuasive paragraph here (2-3 sentences)."
}
`,
    proposalPrompt: (productName, shortDesc, roiData, customerName, company) => `
You are a senior sales executive at Autocon Solutions.
Write a professional, persuasive Business Proposal for ${customerName} at ${company || "their company"}.
The proposal is for the "${productName}" system (${shortDesc}).

The financial impact metrics are:
- Total Investment: ₹${roiData.systemCost}
- Manual Workers Replaced: ${roiData.workersReplaced}
- Monthly Savings: ₹${roiData.monthlySavings}
- Payback Period: ${roiData.paybackPeriod} Months

Please generate a 3-part proposal text. Use a professional, B2B corporate tone. Focus heavily on automation, efficiency, and the massive financial ROI they will achieve.

Return ONLY a valid JSON object exactly as follows, with no markdown formatting around it:
{
  "executiveSummary": "A 3-sentence high-level summary of the partnership.",
  "technicalSolution": "A 3-sentence description of how the ${productName} will resolve their manual inefficiencies.",
  "financialImpact": "A 3-sentence persuasive explanation of the ROI, payback period, and long-term savings."
}
`
};
