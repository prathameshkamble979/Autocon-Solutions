const express = require('express');
const router = express.Router();
const {
    getCaseStudies,
    getCaseStudyBySlug,
    createCaseStudy,
    updateCaseStudy,
    deleteCaseStudy
} = require('../controllers/caseStudyController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.route('/')
    .get(getCaseStudies)
    .post(protect, upload.fields([{ name: 'mainImage', maxCount: 1 }, { name: 'images', maxCount: 10 }]), createCaseStudy);

router.route('/slug/:slug').get(getCaseStudyBySlug);

router.route('/:id')
    .put(protect, upload.fields([{ name: 'mainImage', maxCount: 1 }, { name: 'images', maxCount: 10 }]), updateCaseStudy)
    .delete(protect, deleteCaseStudy);

module.exports = router;
