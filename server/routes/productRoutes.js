
const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductById,
    getFeaturedProducts,
    getSubcategories,
    createProduct,
    updateProduct,
    deleteProduct,
} = require('../controllers/productController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.route('/').get(getProducts).post(protect, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), createProduct);
router.get('/featured', getFeaturedProducts);
router.get('/subcategories', getSubcategories);
router.get('/slug/:slug', require('../controllers/productController').getProductBySlug);
router.route('/:id').get(getProductById).put(protect, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), updateProduct).delete(protect, deleteProduct);

module.exports = router;
