const axios = require('axios');
const storage = require('../utils/storage');
const {
  deriveClinicalFactors,
  generateRecommendations,
  generateAISummary
} = require('../utils/clinicalLogic');

const FLASK_API_URL = process.env.FLASK_API_URL || 'http://127.0.0.1:5000';

/**
 * Generates a structured prediction identifier.
 */
function generatePredictionId() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `LSAI-${timestamp}-${randomSuffix}`;
}

/**
 * Calculates Body Mass Index (BMI) if height (cm) & weight (kg) are given.
 */
function calculateBMI(heightCm, weightKg) {
  if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) return null;
  const heightM = heightCm / 100;
  return Number((weightKg / (heightM * heightM)).toFixed(1));
}

/**
 * POST /api/predict or POST /api/patients
 * Submits patient features to Flask ML model, applies clinical rules, saves record, and returns full report.
 */
async function predictAndSave(req, res) {
  try {
    const data = req.body;

    if (!data || typeof data !== 'object') {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid request payload. Request body must be a JSON object.'
      });
    }

    // Required Demographics
    const name = data.name || data.patientName || 'Anonymous Patient';
    const age = Number(data.Age || data.age);
    const gender = data.Sex || data.gender || 'M';
    const contact = data.contact || data.contactNumber || '';
    const height = data.height ? Number(data.height) : null;
    const weight = data.weight ? Number(data.weight) : null;
    const bmi = calculateBMI(height, weight);

    // Extract 11 ML features with canonical naming
    const features = {
      Age: age,
      Sex: String(data.Sex || data.gender || 'M').toUpperCase().startsWith('F') ? 'F' : 'M',
      ChestPainType: String(data.ChestPainType || 'ASY').toUpperCase(),
      RestingBP: Number(data.RestingBP || 120),
      Cholesterol: Number(data.Cholesterol || 200),
      FastingBS: Number(data.FastingBS === true || data.FastingBS === 1 || data.FastingBS === '1' ? 1 : 0),
      RestingECG: String(data.RestingECG || 'Normal'),
      MaxHR: Number(data.MaxHR || 140),
      ExerciseAngina: String(data.ExerciseAngina || 'N').toUpperCase().startsWith('Y') ? 'Y' : 'N',
      Oldpeak: Number(data.Oldpeak !== undefined ? data.Oldpeak : 0.0),
      ST_Slope: String(data.ST_Slope || 'Flat')
    };

    // Forward feature vector to Flask ML API
    let mlResponse;
    try {
      mlResponse = await axios.post(`${FLASK_API_URL}/predict`, features, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 8000
      });
    } catch (mlErr) {
      console.error('Error calling Flask ML Service:', mlErr.message);
      if (mlErr.response && mlErr.response.data) {
        return res.status(mlErr.response.status || 400).json({
          status: 'error',
          error: 'ML Prediction Validation Error',
          details: mlErr.response.data
        });
      }
      return res.status(503).json({
        status: 'error',
        error: 'ML Service Unavailable',
        message: 'Could not connect to the Python Flask ML Service at ' + FLASK_API_URL + '. Please ensure ml-service/app.py is running.'
      });
    }

    const { prediction, risk_category, risk_percentage } = mlResponse.data;

    // Apply Clinical Reasoning Engine
    const clinicalFactors = deriveClinicalFactors(features);
    const recommendations = generateRecommendations(features, risk_category);
    const aiSummary = generateAISummary({ name, ...features }, risk_percentage, risk_category, clinicalFactors);
    const predictionId = generatePredictionId();

    const patientRecord = {
      predictionId,
      name,
      age,
      gender,
      contact,
      height,
      weight,
      bmi,
      features,
      prediction,
      risk_percentage,
      risk_category,
      clinical_factors: clinicalFactors,
      recommendations,
      ai_summary: aiSummary,
      createdAt: new Date()
    };

    // Save to Database / Storage
    const savedRecord = await storage.savePatient(patientRecord);

    return res.status(201).json({
      status: 'success',
      message: 'Prediction evaluated and patient record saved successfully.',
      data: savedRecord
    });
  } catch (err) {
    console.error('Unexpected error in predictAndSave:', err);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error processing patient prediction.',
      error: err.message
    });
  }
}

/**
 * GET /api/patients
 * Retrieves patient list with priority sorting (highest risk first), search, and risk filter.
 */
async function getAllPatients(req, res) {
  try {
    const { search, filter, sort } = req.query;
    const patients = await storage.findPatients({ search, filter, sort });
    return res.status(200).json({
      status: 'success',
      count: patients.length,
      data: patients
    });
  } catch (err) {
    console.error('Error fetching patients:', err);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve patient history.',
      error: err.message
    });
  }
}

/**
 * GET /api/patients/:id
 * Retrieves a single patient report by MongoDB ID or PredictionID.
 */
async function getPatientById(req, res) {
  try {
    const { id } = req.params;
    const patient = await storage.findPatientById(id);
    if (!patient) {
      return res.status(404).json({
        status: 'error',
        message: `Patient with ID '${id}' not found.`
      });
    }
    return res.status(200).json({
      status: 'success',
      data: patient
    });
  } catch (err) {
    console.error('Error fetching patient details:', err);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve patient record.',
      error: err.message
    });
  }
}

/**
 * DELETE /api/patients/:id
 * Removes a patient record.
 */
async function deletePatient(req, res) {
  try {
    const { id } = req.params;
    const success = await storage.deletePatient(id);
    if (!success) {
      return res.status(404).json({
        status: 'error',
        message: `Patient with ID '${id}' could not be found to delete.`
      });
    }
    return res.status(200).json({
      status: 'success',
      message: 'Patient record deleted successfully.'
    });
  } catch (err) {
    console.error('Error deleting patient:', err);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to delete patient record.',
      error: err.message
    });
  }
}

/**
 * GET /api/analytics
 * Returns aggregated statistics, distributions, and timeline for charts.
 */
async function getAnalytics(req, res) {
  try {
    const analytics = await storage.getAnalytics();
    return res.status(200).json({
      status: 'success',
      data: analytics
    });
  } catch (err) {
    console.error('Error fetching analytics:', err);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to generate analytics data.',
      error: err.message
    });
  }
}

/**
 * GET /api/health
 * Checks health of Express backend, MongoDB, and Flask ML API.
 */
async function checkHealth(req, res) {
  let flaskStatus = 'unreachable';
  let flaskDetails = null;

  try {
    const resp = await axios.get(`${FLASK_API_URL}/health`, { timeout: 3000 });
    flaskStatus = resp.data.status || 'healthy';
    flaskDetails = resp.data;
  } catch (err) {
    flaskStatus = 'offline';
  }

  return res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    backend: 'Express.js online',
    database: storage.isMongoConnected() ? 'MongoDB Connected' : 'Local Fallback Storage Active',
    ml_service: {
      url: FLASK_API_URL,
      status: flaskStatus,
      details: flaskDetails
    }
  });
}

module.exports = {
  predictAndSave,
  getAllPatients,
  getPatientById,
  deletePatient,
  getAnalytics,
  checkHealth
};
