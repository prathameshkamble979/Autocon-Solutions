const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Company = require('./models/Company');

dotenv.config();

const checkData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const companies = await Company.find({});
        console.log('COMPANIES_DATA:', JSON.stringify(companies, null, 2));
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkData();
