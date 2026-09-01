const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Patient = require('../models/Patient');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'patients.json');

// Ensure fallback data directory and file exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
}

/**
 * Reads local JSON fallback store.
 */
function readLocalData() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw) || [];
  } catch (err) {
    console.error('Error reading local patients.json:', err.message);
    return [];
  }
}

/**
 * Writes to local JSON fallback store.
 */
function writeLocalData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing to local patients.json:', err.message);
    return false;
  }
}

/**
 * Checks if MongoDB is currently connected.
 */
function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}

/**
 * Saves a new patient record to MongoDB or fallback JSON storage.
 */
async function savePatient(patientData) {
  if (isMongoConnected()) {
    try {
      const patient = new Patient(patientData);
      const saved = await patient.save();
      return saved.toObject();
    } catch (err) {
      console.warn('MongoDB save failed, saving to local fallback storage:', err.message);
    }
  }

  // Local fallback storage
  const patients = readLocalData();
  const newRecord = {
    _id: `local_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    ...patientData,
    createdAt: patientData.createdAt || new Date().toISOString()
  };
  patients.unshift(newRecord);
  writeLocalData(patients);
  return newRecord;
}

/**
 * Retrieves all patients with search, filtering, and priority sorting.
 */
async function findPatients({ search, filter, sort = 'highest_risk' } = {}) {
  if (isMongoConnected()) {
    try {
      let query = {};
      if (search && search.trim()) {
        query.name = { $regex: search.trim(), $options: 'i' };
      }
      if (filter && filter !== 'All') {
        query.risk_category = filter;
      }

      let sortOptions = { risk_percentage: -1, createdAt: -1 }; // Default highest risk
      if (sort === 'lowest_risk') {
        sortOptions = { risk_percentage: 1, createdAt: -1 };
      } else if (sort === 'newest') {
        sortOptions = { createdAt: -1 };
      } else if (sort === 'oldest') {
        sortOptions = { createdAt: 1 };
      }

      const results = await Patient.find(query).sort(sortOptions).lean();
      return results;
    } catch (err) {
      console.warn('MongoDB query failed, using local storage:', err.message);
    }
  }

  // Local fallback querying
  let patients = readLocalData();

  if (search && search.trim()) {
    const s = search.trim().toLowerCase();
    patients = patients.filter(p => p.name && p.name.toLowerCase().includes(s));
  }

  if (filter && filter !== 'All') {
    patients = patients.filter(p => p.risk_category === filter);
  }

  // Sorting
  if (sort === 'lowest_risk') {
    patients.sort((a, b) => (a.risk_percentage || 0) - (b.risk_percentage || 0));
  } else if (sort === 'newest') {
    patients.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (sort === 'oldest') {
    patients.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  } else {
    // Default highest risk
    patients.sort((a, b) => (b.risk_percentage || 0) - (a.risk_percentage || 0));
  }

  return patients;
}

/**
 * Retrieves a single patient by ID or PredictionID.
 */
async function findPatientById(id) {
  if (isMongoConnected()) {
    try {
      let patient = null;
      if (mongoose.Types.ObjectId.isValid(id)) {
        patient = await Patient.findById(id).lean();
      }
      if (!patient) {
        patient = await Patient.findOne({ predictionId: id }).lean();
      }
      if (patient) return patient;
    } catch (err) {
      console.warn('MongoDB findById failed, checking local storage:', err.message);
    }
  }

  const patients = readLocalData();
  return patients.find(p => p._id === id || p.predictionId === id) || null;
}

/**
 * Deletes a patient by ID or PredictionID.
 */
async function deletePatient(id) {
  if (isMongoConnected()) {
    try {
      let result = null;
      if (mongoose.Types.ObjectId.isValid(id)) {
        result = await Patient.findByIdAndDelete(id);
      }
      if (!result) {
        result = await Patient.findOneAndDelete({ predictionId: id });
      }
      if (result) return true;
    } catch (err) {
      console.warn('MongoDB delete failed, checking local storage:', err.message);
    }
  }

  const patients = readLocalData();
  const initialLen = patients.length;
  const filtered = patients.filter(p => p._id !== id && p.predictionId !== id);
  if (filtered.length < initialLen) {
    writeLocalData(filtered);
    return true;
  }
  return false;
}

/**
 * Computes aggregated analytics for charts & KPI cards.
 */
async function getAnalytics() {
  const patients = await findPatients({ sort: 'newest' });
  const total = patients.length;

  if (total === 0) {
    return {
      totalPatients: 0,
      highRiskCount: 0,
      moderateRiskCount: 0,
      lowRiskCount: 0,
      averageRisk: 0,
      highestRisk: 0,
      lowestRisk: 0,
      riskDistribution: [
        { name: 'High Risk', count: 0, percentage: 0, color: '#ef4444' },
        { name: 'Moderate Risk', count: 0, percentage: 0, color: '#f59e0b' },
        { name: 'Low Risk', count: 0, percentage: 0, color: '#10b981' }
      ],
      topHighRiskPatients: [],
      predictionsOverTime: [],
      factorPrevalence: []
    };
  }

  let highCount = 0;
  let modCount = 0;
  let lowCount = 0;
  let sumRisk = 0;
  let maxRisk = -Infinity;
  let minRisk = Infinity;

  const factorCounts = {};

  patients.forEach(p => {
    const risk = Number(p.risk_percentage) || 0;
    sumRisk += risk;
    if (risk > maxRisk) maxRisk = risk;
    if (risk < minRisk) minRisk = risk;

    if (p.risk_category === 'High Risk') highCount++;
    else if (p.risk_category === 'Moderate Risk') modCount++;
    else lowCount++;

    // Count factors
    if (p.clinical_factors && Array.isArray(p.clinical_factors)) {
      p.clinical_factors.forEach(f => {
        factorCounts[f.factor] = (factorCounts[f.factor] || 0) + 1;
      });
    }
  });

  const avgRisk = Number((sumRisk / total).toFixed(1));

  const riskDistribution = [
    { name: 'High Risk', count: highCount, percentage: Number(((highCount / total) * 100).toFixed(1)), color: '#ef4444' },
    { name: 'Moderate Risk', count: modCount, percentage: Number(((modCount / total) * 100).toFixed(1)), color: '#f59e0b' },
    { name: 'Low Risk', count: lowCount, percentage: Number(((lowCount / total) * 100).toFixed(1)), color: '#10b981' }
  ];

  // Top 5 High Risk Patients
  const topHighRiskPatients = [...patients]
    .sort((a, b) => (b.risk_percentage || 0) - (a.risk_percentage || 0))
    .slice(0, 6)
    .map(p => ({
      id: p.predictionId || p._id,
      name: p.name,
      age: p.age,
      gender: p.gender,
      risk_percentage: p.risk_percentage,
      risk_category: p.risk_category
    }));

  // Predictions timeline (group by date or last entries)
  const timelineMap = {};
  patients.forEach(p => {
    const dateStr = new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (!timelineMap[dateStr]) {
      timelineMap[dateStr] = { date: dateStr, count: 0, avgRisk: 0, totalRisk: 0 };
    }
    timelineMap[dateStr].count += 1;
    timelineMap[dateStr].totalRisk += (p.risk_percentage || 0);
  });

  const predictionsOverTime = Object.values(timelineMap).map(item => ({
    date: item.date,
    count: item.count,
    avgRisk: Number((item.totalRisk / item.count).toFixed(1))
  }));

  // Factor prevalence sorted
  const factorPrevalence = Object.entries(factorCounts)
    .map(([factor, count]) => ({
      factor,
      count,
      percentage: Number(((count / total) * 100).toFixed(1))
    }))
    .sort((a, b) => b.count - a.count);

  return {
    totalPatients: total,
    highRiskCount: highCount,
    moderateRiskCount: modCount,
    lowRiskCount: lowCount,
    averageRisk: avgRisk,
    highestRisk: maxRisk === -Infinity ? 0 : maxRisk,
    lowestRisk: minRisk === Infinity ? 0 : minRisk,
    riskDistribution,
    topHighRiskPatients,
    predictionsOverTime,
    factorPrevalence
  };
}

module.exports = {
  savePatient,
  findPatients,
  findPatientById,
  deletePatient,
  getAnalytics,
  isMongoConnected,
  readLocalData,
  writeLocalData
};
