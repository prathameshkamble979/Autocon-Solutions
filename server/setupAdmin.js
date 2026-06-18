const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Check/Create Admin
        let admin = await Admin.findOne({ email: 'autoconlpp@gmail.com' });
        if (!admin) {
            admin = new Admin({
                email: 'autoconlpp@gmail.com',
                password: 'Admin123!',
            });
            await admin.save();
            console.log('✅ Created Admin: autoconlpp@gmail.com / Admin123!');
        } else {
             console.log('ℹ️ Admin already exists: autoconlpp@gmail.com');
        }

        console.log('\n=============================================');
        console.log('LOGIN CREDENTIALS:');
        console.log('=============================================');
        console.log('   Login URL: http://localhost:5173/admin/login');
        console.log('   Email:     autoconlpp@gmail.com');
        console.log('   Password:  Admin123!');
        console.log('=============================================');

        process.exit();
    } catch (error) {
        console.error('Seed Error:', error);
        process.exit(1);
    }
};

seedData();
