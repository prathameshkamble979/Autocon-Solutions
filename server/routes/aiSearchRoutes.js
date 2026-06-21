const express = require('express');
const router = express.Router();
const aiSearchController = require('../controllers/aiSearchController');

router.post('/', aiSearchController.semanticSearch);

module.exports = router;
