const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  predictionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  // Demographics
  name: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['M', 'F', 'Male', 'Female', 'Other']
  },
  contact: {
    type: String,
    default: ''
  },
  height: {
    type: Number,
    default: null
  },
  weight: {
    type: Number,
    default: null
  },
  bmi: {
    type: Number,
    default: null
  },
  // 11 Clinical Features for ML Model
  features: {
    Age: { type: Number, required: true },
    Sex: { type: String, required: true },
    ChestPainType: { type: String, required: true },
    RestingBP: { type: Number, required: true },
    Cholesterol: { type: Number, required: true },
    FastingBS: { type: Number, required: true },
    RestingECG: { type: String, required: true },
    MaxHR: { type: Number, required: true },
    ExerciseAngina: { type: String, required: true },
    Oldpeak: { type: Number, required: true },
    ST_Slope: { type: String, required: true }
  },
  // ML Model Prediction Output
  prediction: {
    type: Number,
    required: true // 0 or 1
  },
  risk_percentage: {
    type: Number,
    required: true // e.g. 91.4
  },
  risk_category: {
    type: String,
    required: true,
    enum: ['High Risk', 'Moderate Risk', 'Low Risk']
  },
  // Clinical Rule-Based Factors & Recommendations
  clinical_factors: [{
    factor: String,
    description: String,
    severity: String,
    icon: String
  }],
  recommendations: [{
    category: String,
    title: String,
    icon: String,
    color: String,
    items: [String]
  }],
  ai_summary: {
    type: String,
    required: true
  },
  disclaimer: {
    type: String,
    default: 'This report is generated using an AI-assisted machine learning model for educational and demonstration purposes only. It should not be used as a substitute for professional medical diagnosis or treatment.'
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Priority sorting index: highest risk first, then newest
PatientSchema.index({ risk_percentage: -1, createdAt: -1 });

module.exports = mongoose.model('Patient', PatientSchema);
