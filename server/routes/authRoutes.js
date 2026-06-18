
const express = require('express');
const router = express.Router();
const { authAdmin, registerAdmin, googleLogin, getMe, updateProfile } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/login', authAdmin);
router.post('/google', googleLogin);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

// Admin registration — only allowed in development mode
// After creating admin, comment this out or remove in production
if (process.env.NODE_ENV === 'development') {
    router.post('/register', registerAdmin);
}

module.exports = router;
