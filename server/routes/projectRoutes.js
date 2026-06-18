
const express = require('express');
const router = express.Router();
const {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
} = require('../controllers/projectController');
const { protect } = require('../middlewares/authMiddleware');

const upload = require('../middlewares/uploadMiddleware');

router.route('/').get(getProjects).post(protect, upload.array('images', 5), createProject);
router.route('/:id').get(getProjectById).put(protect, upload.array('images', 5), updateProject).delete(protect, deleteProject);

module.exports = router;
