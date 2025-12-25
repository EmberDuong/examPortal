const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db');

// Route imports
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const questionRoutes = require('./routes/questions');
const examRoutes = require('./routes/exams');
const resultRoutes = require('./routes/results');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/results', resultRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve static files in production (only if frontend is bundled with backend)
if (process.env.NODE_ENV === 'production') {
    const distPath = path.join(__dirname, '../dist');
    const fs = require('fs');

    // Only serve static files if dist folder exists
    if (fs.existsSync(distPath)) {
        app.use(express.static(distPath));

        app.get('*', (req, res) => {
            // Don't serve index.html for API routes
            if (!req.path.startsWith('/api')) {
                res.sendFile(path.join(distPath, 'index.html'));
            }
        });
        console.log('Serving frontend from:', distPath);
    } else {
        console.log('No frontend dist folder found. Running as API-only server.');
    }
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API: http://localhost:${PORT}/api`);
});
