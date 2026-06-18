require('dotenv').config({ path: './.env' });
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const testMail = async () => {
    console.log(`Explicit Host/Port Test: ${process.env.EMAIL_USER}`);
    
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: 'AUTOCON - SMTP Test 2',
            text: 'Testing with explicit smtp.gmail.com host and port 465.',
        });
        console.log('✅ Success! ' + info.response);
    } catch (error) {
        console.error('❌ Failed SMTP 2:');
        console.error(error);
    }
};

testMail();
