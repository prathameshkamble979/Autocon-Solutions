
const mongoose = require('mongoose');

const connectDB = async (retries = 5) => {
    while (retries) {
        try {
            const conn = await mongoose.connect(process.env.MONGO_URI, {
                serverSelectionTimeoutMS: 5000,
                family: 4, // Connect using IPv4
            });

            console.log(`MongoDB Connected: ${conn.connection.host}`);
            break;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            retries -= 1;
            console.log(`Retries left: ${retries}`);
            if (retries === 0) {
                process.exit(1);
            }
            // Wait 2 seconds before retrying
            await new Promise(res => setTimeout(res, 2000));
        }
    }
};

module.exports = connectDB;
