const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const patientRoutes = require('./routes/patientRoutes');

const app = express();
const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lifescan_ai';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// MongoDB Connection with Auto-Fallback
mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 3000
})
.then(() => {
  console.log('✅ Connected to MongoDB at:', MONGODB_URI);
})
.catch((err) => {
  console.warn('⚠️ MongoDB connection unavailable (' + err.message + ').');
  console.log('📦 Using robust local persistent storage (backend/data/patients.json).');
});

// API Routes
app.use('/api', patientRoutes);

// Root Health Route
app.get('/', (req, res) => {
  res.json({
    project: 'LifeScan AI — Heart Failure Detection System Backend',
    version: '1.0.0',
    status: 'online',
    endpoints: {
      predict: 'POST /api/predict',
      patients: 'GET /api/patients',
      analytics: 'GET /api/analytics',
      health: 'GET /api/health'
    }
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route '${req.originalUrl}' not found.`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error.',
    error: err.message
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🏥 LifeScan AI Express Backend running on port ${PORT}`);
  console.log(`📡 Base API URL: http://localhost:${PORT}/api`);
  console.log(`🤖 Connected ML Service: ${process.env.FLASK_API_URL || 'http://127.0.0.1:5000'}`);
  console.log(`====================================================`);
});
