
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

// Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });

// Connect to database
const connectDB = require('./config/db');
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression()); // Compress all responses

// Rate limiting
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // Limit each IP to 200 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api', apiLimiter);

// CORS - allow local dev and configurable production origin
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    process.env.CLIENT_URL, // set this in .env for production
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (e.g. mobile apps, curl, Postman)
        if (!origin) return callback(null, true);
        if (process.env.NODE_ENV === 'development') return callback(null, true);
        
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error('Not allowed by CORS')); // Restrict in production
    },
    credentials: true,
}));

app.use(helmet());

// Uploads directory (local fallback)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/case-studies', require('./routes/caseStudyRoutes'));
app.use('/api/ai/advisor', require('./routes/aiAdvisorRoutes'));
app.use('/api/ai/search', require('./routes/aiSearchRoutes'));
app.use('/api/quotes', require('./routes/quoteRoutes'));
app.use('/api/proposals', require('./routes/proposalRoutes'));

// 404 handler for unknown API routes
app.use('/api/*', (req, res) => {
    res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// Serve Frontend in Production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get('*', (req, res) =>
        res.sendFile(
            path.resolve(__dirname, '../client/dist/index.html')
        )
    );
} else {
    // Root route for local dev
    app.get('/', (req, res) => {
        res.send('Autocon Solutions API is running in Development mode...');
    });
}

// Global error handler — catches any unhandled errors in controllers
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
