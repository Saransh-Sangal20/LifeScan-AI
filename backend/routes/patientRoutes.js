const express = require('express');
const router = express.Router();
const {
  predictAndSave,
  getAllPatients,
  getPatientById,
  deletePatient,
  getAnalytics,
  checkHealth
} = require('../controllers/patientController');

// Prediction & Creation
router.post('/predict', predictAndSave);
router.post('/patients', predictAndSave);

// Retrieval & Priority Listing
router.get('/patients', getAllPatients);
router.get('/patients/:id', getPatientById);

// Record Removal
router.delete('/patients/:id', deletePatient);

// Analytics & Metrics
router.get('/analytics', getAnalytics);

// Health & Microservice connectivity check
router.get('/health', checkHealth);

module.exports = router;
