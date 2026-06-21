const express = require('express');
const router = express.Router();
const proposalController = require('../controllers/proposalController');

router.post('/generate', proposalController.generateProposal);
router.get('/', proposalController.getProposals);

module.exports = router;
