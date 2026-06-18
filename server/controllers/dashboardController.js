const Booking = require('../models/Booking');
const Product = require('../models/Product');
const CaseStudy = require('../models/CaseStudy');
const Project = require('../models/Project');

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const totalProjects = await Project.countDocuments();
        const totalCaseStudies = await CaseStudy.countDocuments();
        const totalBookings = await Booking.countDocuments();
        const newBookings = await Booking.countDocuments({ status: 'NEW' });

        // Get recent bookings
        const recentBookings = await Booking.find({})
            .sort({ createdAt: -1 })
            .limit(5);

        // Get recent messages (General Enquiries)
        const recentMessages = await Booking.find({ type: 'GENERAL' })
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            counts: {
                products: totalProducts,
                projects: totalProjects,
                caseStudies: totalCaseStudies,
                bookings: totalBookings,
                newBookings: newBookings
            },
            recentBookings,
            recentMessages
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getDashboardStats
};
