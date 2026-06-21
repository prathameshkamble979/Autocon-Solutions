const express = require('express');
const router = express.Router();
const quoteController = require('../controllers/quoteController');

// For generating a new quote from the frontend
router.post('/generate', quoteController.generateQuote);

// For admin dashboard to view quotes
router.get('/', quoteController.getQuotes);

module.exports = router;
