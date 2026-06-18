
const express = require('express');
const router = express.Router();
const {
    createBooking,
    getBookings,
    updateBookingStatus,
    deleteBooking,
} = require('../controllers/bookingController');
const { protect } = require('../middlewares/authMiddleware');

const upload = require('../middlewares/uploadMiddleware');

router.route('/').post(upload.single('drawing'), createBooking).get(protect, getBookings);
router.route('/:id')
    .put(protect, updateBookingStatus)
    .delete(protect, deleteBooking);

module.exports = router;
