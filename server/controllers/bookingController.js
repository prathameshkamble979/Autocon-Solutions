
const Booking = require('../models/Booking');
const sendEmail = require('../config/email');

// @desc    Create a booking / enquiry
// @route   POST /api/bookings
// @access  Public
const createBooking = async (req, res) => {
    try {
        const { type, source, name, company, phone, email, product, preferredDate, quantity, message, industry, budget, timeline, requirementType } = req.body;

        let drawing = '';
        if (req.file) {
            drawing = req.file.path;
        }

        // 1. Duplicate Check (same phone or email within last 10 minutes)
        const tenMinsAgo = new Date(Date.now() - 10 * 60 * 1000);
        const duplicateMatch = await Booking.findOne({
            $or: [{ email }, { phone }],
            createdAt: { $gte: tenMinsAgo }
        });
        const isDuplicate = !!duplicateMatch;

        // 2. Priority Logic
        let priority = 'MEDIUM';
        if (message && message.length > 50 && requirementType === 'NEW' && product) {
            priority = 'HIGH';
        } else if (!message || message.length < 15) {
            priority = 'LOW';
        }

        const booking = new Booking({
            type,
            source: source || 'Website',
            name,
            company,
            phone,
            email,
            product,
            preferredDate,
            quantity,
            message,
            industry,
            budget,
            timeline,
            drawing,
            priority,
            requirementType,
            isDuplicate
        });

        const createdBooking = await booking.save();

        // 3. Send email to Sales Team
        const adminEmailContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                <div style="background-color: ${priority === 'HIGH' ? '#dc2626' : priority === 'MEDIUM' ? '#f59e0b' : '#16a34a'}; color: white; padding: 10px 15px; border-radius: 5px; font-weight: bold; margin-bottom: 20px;">
                    New Lead: ${priority} Priority ${isDuplicate ? '(Possible Duplicate)' : ''}
                </div>
                <h3>Lead Details</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Source:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${source || 'Website'}</td></tr>
                    <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Type:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${type}</td></tr>
                    <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Requirement:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${requirementType || 'N/A'}</td></tr>
                    <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Name:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${name}</td></tr>
                    <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Company:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${company || 'N/A'}</td></tr>
                    <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Phone:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${phone}</td></tr>
                    <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Email:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${email}</td></tr>
                    <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Product/Focus:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${product || 'N/A'}</td></tr>
                    <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Quantity:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${quantity || 'N/A'}</td></tr>
                </table>
                <div style="margin-top: 20px; background: #f9f9f9; padding: 15px; border-radius: 5px;">
                    <strong>Message/Specs:</strong><br>
                    <p style="white-space: pre-wrap; margin-top: 5px;">${message || 'N/A'}</p>
                </div>
                ${drawing ? `<p style="margin-top: 20px;"><strong>Attachment:</strong> <a href="${drawing}" style="color: #2563eb;">View Drawing</a></p>` : ''}
            </div>
        `;

        // 4. Send Professional Auto-Reply to User
        const userEmailContent = `
            <div style="font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                <div style="background-color: #0f172a; padding: 24px; text-align: center;">
                    <h2 style="color: #f59e0b; margin: 0; font-size: 22px;">Autocon Solutions</h2>
                </div>
                <div style="padding: 32px;">
                    <p style="font-size: 16px;">Dear <strong>${name}</strong>,</p>
                    <p style="font-size: 16px;">Thank you for getting in touch with Autocon Solutions. Your enquiry has been successfully received by our engineering team.</p>
                    <p style="font-size: 16px;">We are currently reviewing your specific requirements regarding <strong>${product || 'our material handling solutions'}</strong>. One of our technical sales experts will be assigned to your request and will contact you <strong>within the next 24 hours</strong> with a detailed response or quotation.</p>
                    
                    <div style="background-color: #f8fafc; border-left: 4px solid #f59e0b; padding: 16px; margin: 24px 0; border-radius: 0 4px 4px 0;">
                        <p style="margin: 0; font-size: 14px; color: #64748b;">If your request is urgent, you can reach us immediately at:</p>
                        <p style="margin: 8px 0 0; font-size: 16px; font-weight: bold; color: #0f172a;">Sales & Support: +91 87883 45829</p>
                    </div>

                    <p style="font-size: 16px;">We look forward to building a successful partnership and providing you with the highest quality engineered solutions.</p>
                    
                    <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb; font-size: 14px; color: #64748b;">
                        Best Regards,<br>
                        <strong>Sales Delivery Team</strong><br>
                        Autocon Solutions LLP<br>
                        <a href="https://autocon.co.in" style="color: #3b82f6; text-decoration: none;">www.autocon.co.in</a>
                    </div>
                </div>
            </div>
        `;

        const salesEmail = 'sales@autocon.co.in';

        // Only email sales if not a fast duplicate, or if it is a duplicate, maybe still send but mark it
        await sendEmail(salesEmail, `${priority === 'HIGH' ? '[URGENT] ' : ''}New Lead from ${name} - Autocon Solutions`, adminEmailContent);

        if (email && !isDuplicate) {
            await sendEmail(email, `Your Enquiry has been received - Autocon Solutions`, userEmailContent);
        }

        res.status(201).json(createdBooking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin
const getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ }).sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id
// @access  Private/Admin
const updateBookingStatus = async (req, res) => {
    const { status, adminNote } = req.body;
    try {
        const booking = await Booking.findOne({ _id: req.params.id, });
        
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        const oldStatus = booking.status;
        booking.status = status;
        const updatedBooking = await booking.save();

        // If status changed to ACCEPTED or REJECTED for a VISIT
        if (booking.type === 'VISIT' && (status === 'ACCEPTED' || status === 'REJECTED')) {
            // Only send if the status actually CHANGED to these values
            if (oldStatus !== status) {
                const isAccepted = status === 'ACCEPTED';
                const subject = isAccepted 
                    ? `Visit Request Accepted - Autocon Solutions`
                    : `Update on your Visit Request - Autocon Solutions`;

                const emailContent = `
                    <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 12px; overflow: hidden;">
                        <div style="background-color: ${isAccepted ? '#16a34a' : '#dc2626'}; padding: 25px; text-align: center; color: white;">
                             <h2 style="margin: 0; font-size: 24px;">Visit Request ${isAccepted ? 'Accepted' : 'Update'}</h2>
                        </div>
                        <div style="padding: 30px;">
                            <p>Dear <strong>${booking.name}</strong>,</p>
                            <p>We are writing to provide an update regarding your request for a site visit to Autocon Solutions.</p>
                            
                            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                                <p style="margin: 0; color: #64748b; font-size: 13px; font-weight: bold; text-transform: uppercase;">Current Status</p>
                                <p style="margin: 5px 0 0; font-size: 18px; color: ${isAccepted ? '#16a34a' : '#dc2626'}; font-weight: bold;">
                                    ${status}
                                </p>
                                ${booking.preferredDate ? `<p style="margin: 10px 0 0; font-size: 14px; color: #334155;"><strong>Date:</strong> ${new Date(booking.preferredDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>` : ''}
                            </div>

                            ${adminNote ? `
                                <div style="background: #fffbeb; padding: 15px; border-left: 4px solid #f59e0b; margin: 20px 0; border-radius: 4px;">
                                    <p style="margin: 0; font-size: 14px; color: #92400e;"><strong>Message from Engineeering Team:</strong></p>
                                    <p style="margin: 5px 0 0; font-size: 15px; color: #451a03;">${adminNote}</p>
                                </div>
                            ` : ''}

                            ${isAccepted ? `
                                <p>Our team will contact you shortly at <strong>${booking.phone}</strong> to coordinate the final arrangements and confirm the specific time for your arrival.</p>
                            ` : `
                                <p>We regret to inform you that we cannot accommodate the visit at the requested time. However, we would still love to show you our facility. Our team will reach out to you shortly to discuss alternative dates and times.</p>
                            `}

                            <p style="margin-top: 30px; border-top: 1px solid #f1f5f9; pt-20">
                                Best Regards,<br>
                                <strong>Engineering Team</strong><br>
                                Autocon Solutions LLP
                            </p>
                        </div>
                    </div>
                `;

                if (booking.email) {
                    await sendEmail(booking.email, subject, emailContent);
                    console.log(`✅ ${status} email sent successfully to: ${booking.email}`);
                }
            }
        }

        res.json(updatedBooking);
    } catch (error) {
        console.error('Update Status Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a booking
// @route   DELETE /api/bookings/:id
// @access  Private/Admin
const deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (booking) {
            await booking.deleteOne();
            res.json({ message: 'Booking removed' });
        } else {
            res.status(404).json({ message: 'Booking not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createBooking,
    getBookings,
    updateBookingStatus,
    deleteBooking,
};
