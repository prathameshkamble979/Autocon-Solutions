const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Company = require('./models/Company');

dotenv.config();

const updateBranding = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Update standard record
        const company = await Company.findOne({ $or: [{ domains: 'localhost' }, { domains: '127.0.0.1' }] });
        
        if (company) {
            company.name = 'Autocon Solutions';
            company.domains = ['localhost', '127.0.0.1'];
            company.branding = {
                logo: '', 
                primaryColor: '#F97316', // Orange
                secondaryColor: '#0F172A' // Slate
            };
            company.contactInfo = {
                email: 'autoconlpp@gmail.com',
                phone: '87883 45829',
                address: 'Shop No 2, Sharada warehouse, Abhinav College Rd, Narhe, Pune, Maharashtra 411041'
            };
            
            await company.save();
            console.log('✅ Updated Autocon Solutions and synced domains.');
            
            // Cleanup any blue duplicate
            await Company.deleteMany({ _id: { $ne: company._id }, name: 'Autocon Solutions' });
        } else {
            console.log('❌ Company record not found.');
        }

        process.exit();
    } catch (error) {
        console.error('Update Error:', error);
        process.exit(1);
    }
};

updateBranding();
