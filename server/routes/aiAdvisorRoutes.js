const express = require('express');
const router = express.Router();
const aiAdvisorController = require('../controllers/aiAdvisorController');

router.post('/recommend', aiAdvisorController.getRecommendation);

module.exports = router;
