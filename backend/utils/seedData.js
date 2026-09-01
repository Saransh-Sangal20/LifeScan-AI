const fs = require('fs');
const path = require('path');
const {
  deriveClinicalFactors,
  generateRecommendations,
  generateAISummary
} = require('./clinicalLogic');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'patients.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const samplePatientsRaw = [
  {
    predictionId: 'LSAI-2026-HR01',
    name: 'Robert Vance',
    age: 65,
    gender: 'M',
    contact: '+1 (555) 234-8901',
    height: 175,
    weight: 88,
    bmi: 28.7,
    features: {
      Age: 65,
      Sex: 'M',
      ChestPainType: 'ASY',
      RestingBP: 145,
      Cholesterol: 289,
      FastingBS: 1,
      RestingECG: 'LVH',
      MaxHR: 110,
      ExerciseAngina: 'Y',
      Oldpeak: 2.5,
      ST_Slope: 'Flat'
    },
    prediction: 1,
    risk_percentage: 98.4,
    risk_category: 'High Risk',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString()
  },
  {
    predictionId: 'LSAI-2026-HR02',
    name: 'Elena Rostova',
    age: 71,
    gender: 'F',
    contact: '+1 (555) 345-6712',
    height: 162,
    weight: 76,
    bmi: 29.0,
    features: {
      Age: 71,
      Sex: 'F',
      ChestPainType: 'ASY',
      RestingBP: 155,
      Cholesterol: 298,
      FastingBS: 1,
      RestingECG: 'ST',
      MaxHR: 95,
      ExerciseAngina: 'Y',
      Oldpeak: 3.1,
      ST_Slope: 'Down'
    },
    prediction: 1,
    risk_percentage: 96.2,
    risk_category: 'High Risk',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString()
  },
  {
    predictionId: 'LSAI-2026-HR03',
    name: 'Marcus Sterling',
    age: 58,
    gender: 'M',
    contact: '+1 (555) 456-7890',
    height: 180,
    weight: 92,
    bmi: 28.4,
    features: {
      Age: 58,
      Sex: 'M',
      ChestPainType: 'ASY',
      RestingBP: 148,
      Cholesterol: 275,
      FastingBS: 0,
      RestingECG: 'LVH',
      MaxHR: 118,
      ExerciseAngina: 'Y',
      Oldpeak: 2.2,
      ST_Slope: 'Flat'
    },
    prediction: 1,
    risk_percentage: 89.5,
    risk_category: 'High Risk',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    predictionId: 'LSAI-2026-MR01',
    name: 'Sarah Jenkins',
    age: 54,
    gender: 'F',
    contact: '+1 (555) 567-8901',
    height: 168,
    weight: 68,
    bmi: 24.1,
    features: {
      Age: 54,
      Sex: 'F',
      ChestPainType: 'NAP',
      RestingBP: 132,
      Cholesterol: 242,
      FastingBS: 0,
      RestingECG: 'ST',
      MaxHR: 138,
      ExerciseAngina: 'N',
      Oldpeak: 1.2,
      ST_Slope: 'Flat'
    },
    prediction: 0,
    risk_percentage: 54.0,
    risk_category: 'Moderate Risk',
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString()
  },
  {
    predictionId: 'LSAI-2026-MR02',
    name: 'David Chen',
    age: 52,
    gender: 'M',
    contact: '+1 (555) 678-9012',
    height: 172,
    weight: 79,
    bmi: 26.7,
    features: {
      Age: 52,
      Sex: 'M',
      ChestPainType: 'TA',
      RestingBP: 138,
      Cholesterol: 228,
      FastingBS: 0,
      RestingECG: 'Normal',
      MaxHR: 142,
      ExerciseAngina: 'N',
      Oldpeak: 1.0,
      ST_Slope: 'Flat'
    },
    prediction: 0,
    risk_percentage: 42.5,
    risk_category: 'Moderate Risk',
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString()
  },
  {
    predictionId: 'LSAI-2026-LR01',
    name: 'Clara Oswald',
    age: 38,
    gender: 'F',
    contact: '+1 (555) 789-0123',
    height: 165,
    weight: 58,
    bmi: 21.3,
    features: {
      Age: 38,
      Sex: 'F',
      ChestPainType: 'ATA',
      RestingBP: 116,
      Cholesterol: 182,
      FastingBS: 0,
      RestingECG: 'Normal',
      MaxHR: 168,
      ExerciseAngina: 'N',
      Oldpeak: 0.0,
      ST_Slope: 'Up'
    },
    prediction: 0,
    risk_percentage: 4.2,
    risk_category: 'Low Risk',
    createdAt: new Date(Date.now() - 6 * 86400000).toISOString()
  },
  {
    predictionId: 'LSAI-2026-LR02',
    name: 'James Walker',
    age: 42,
    gender: 'M',
    contact: '+1 (555) 890-1234',
    height: 178,
    weight: 72,
    bmi: 22.7,
    features: {
      Age: 42,
      Sex: 'M',
      ChestPainType: 'ATA',
      RestingBP: 120,
      Cholesterol: 195,
      FastingBS: 0,
      RestingECG: 'Normal',
      MaxHR: 162,
      ExerciseAngina: 'N',
      Oldpeak: 0.0,
      ST_Slope: 'Up'
    },
    prediction: 0,
    risk_percentage: 7.8,
    risk_category: 'Low Risk',
    createdAt: new Date().toISOString()
  }
];

function seed() {
  const enriched = samplePatientsRaw.map(p => {
    const clinicalFactors = deriveClinicalFactors(p.features);
    const recommendations = generateRecommendations(p.features, p.risk_category);
    const aiSummary = generateAISummary(p, p.risk_percentage, p.risk_category, clinicalFactors);
    return {
      ...p,
      clinical_factors: clinicalFactors,
      recommendations,
      ai_summary: aiSummary,
      disclaimer: 'This report is generated using an AI-assisted machine learning model for educational and demonstration purposes only. It should not be used as a substitute for professional medical diagnosis or treatment.'
    };
  });

  // Sort by highest risk first
  enriched.sort((a, b) => b.risk_percentage - a.risk_percentage);

  fs.writeFileSync(DATA_FILE, JSON.stringify(enriched, null, 2), 'utf-8');
  console.log(`✅ Seeded ${enriched.length} clinical patient records into ${DATA_FILE}`);
}

seed();
