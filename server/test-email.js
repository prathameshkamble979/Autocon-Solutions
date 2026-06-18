require('dotenv').config({ path: './.env' });
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const testMail = async () => {
    console.log(`Attempting to send from: ${process.env.EMAIL_USER}`);
    console.log(`Using Service: ${process.env.EMAIL_SERVICE}`);
    
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, // Send to self
        subject: 'AUTOCON - Test Email Connection',
        text: 'This is a test email to verify SMTP configuration.',
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Success! Email sent: ' + info.response);
    } catch (error) {
        console.error('❌ FAILED to send email:');
        console.error(error);
    }
};

testMail();
