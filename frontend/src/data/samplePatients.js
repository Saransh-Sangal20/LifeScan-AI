/**
 * Realistic Indian sample patient records for LifeScan AI prototype demonstration.
 */

export function formatIndianDate(dateInput) {
  if (!dateInput) return '—';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return String(dateInput);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export const SAMPLE_PATIENTS = [
  {
    predictionId: "LSAI-2026-HR01",
    name: "Saransh Sangal",
    age: 65,
    gender: "M",
    contact: "9811234567",
    height: 175,
    weight: 82,
    bmi: 26.8,
    features: {
      Age: 65,
      Sex: "M",
      ChestPainType: "ASY",
      RestingBP: 150,
      Cholesterol: 285,
      FastingBS: 1,
      RestingECG: "LVH",
      MaxHR: 108,
      ExerciseAngina: "Y",
      Oldpeak: 2.8,
      ST_Slope: "Flat"
    },
    prediction: 1,
    risk_percentage: 94.8,
    risk_category: "High Risk",
    createdAt: "2026-09-01T10:30:00.000Z",
    clinical_factors: [
      { factor: "Advanced Age", description: "Age (65 years) contributes to increased vascular resistance.", severity: "moderate" },
      { factor: "High Resting Blood Pressure", description: "Resting BP of 150 mm Hg indicates Stage 2 Hypertension.", severity: "high" },
      { factor: "Elevated Cholesterol Level", description: "Serum cholesterol of 285 mg/dl elevates atherosclerotic plaque risk.", severity: "high" },
      { factor: "Exercise-Induced Angina", description: "Myocardial ischemia during exertion.", severity: "high" }
    ],
    recommendations: [
      { items: ["Reduce sodium intake (< 2,000 mg/day)", "Consult a cardiologist for echocardiogram", "Maintain daily BP monitoring log"] }
    ]
  },
  {
    predictionId: "LSAI-2026-HR02",
    name: "Saurabh Kashyap",
    age: 58,
    gender: "M",
    contact: "9823456789",
    height: 172,
    weight: 78,
    bmi: 26.4,
    features: {
      Age: 58,
      Sex: "M",
      ChestPainType: "ASY",
      RestingBP: 145,
      Cholesterol: 270,
      FastingBS: 1,
      RestingECG: "ST",
      MaxHR: 115,
      ExerciseAngina: "Y",
      Oldpeak: 2.2,
      ST_Slope: "Flat"
    },
    prediction: 1,
    risk_percentage: 88.5,
    risk_category: "High Risk",
    createdAt: "2026-08-30T11:15:00.000Z",
    clinical_factors: [
      { factor: "High Resting Blood Pressure", description: "Resting BP of 145 mm Hg.", severity: "high" },
      { factor: "Elevated Cholesterol Level", description: "Serum cholesterol of 270 mg/dl.", severity: "high" },
      { factor: "Exercise-Induced Angina", description: "Chest pain during physical exertion.", severity: "high" }
    ],
    recommendations: [
      { items: ["Consult a cardiologist", "Low salt diet", "Regular aerobic walking", "Daily BP log"] }
    ]
  },
  {
    predictionId: "LSAI-2026-HR03",
    name: "Sandeep Kumar",
    age: 62,
    gender: "M",
    contact: "9834567890",
    height: 168,
    weight: 75,
    bmi: 26.6,
    features: {
      Age: 62,
      Sex: "M",
      ChestPainType: "ASY",
      RestingBP: 140,
      Cholesterol: 260,
      FastingBS: 0,
      RestingECG: "LVH",
      MaxHR: 120,
      ExerciseAngina: "Y",
      Oldpeak: 1.8,
      ST_Slope: "Flat"
    },
    prediction: 1,
    risk_percentage: 82.1,
    risk_category: "High Risk",
    createdAt: "2026-08-28T09:45:00.000Z",
    clinical_factors: [
      { factor: "Advanced Age", description: "Age (62 years).", severity: "moderate" },
      { factor: "High Resting Blood Pressure", description: "Resting BP of 140 mm Hg.", severity: "high" },
      { factor: "Elevated Cholesterol Level", description: "Serum cholesterol of 260 mg/dl.", severity: "high" }
    ],
    recommendations: [
      { items: ["Cardiology follow-up", "Low sodium diet", "Limit refined carbohydrates", "Routine BP checks"] }
    ]
  },
  {
    predictionId: "LSAI-2026-MR01",
    name: "Samail Ahmad",
    age: 55,
    gender: "M",
    contact: "9712345678",
    height: 170,
    weight: 72,
    bmi: 24.9,
    features: {
      Age: 55,
      Sex: "M",
      ChestPainType: "NAP",
      RestingBP: 135,
      Cholesterol: 245,
      FastingBS: 0,
      RestingECG: "ST",
      MaxHR: 132,
      ExerciseAngina: "N",
      Oldpeak: 1.4,
      ST_Slope: "Flat"
    },
    prediction: 0,
    risk_percentage: 56.4,
    risk_category: "Moderate Risk",
    createdAt: "2026-08-26T14:20:00.000Z",
    clinical_factors: [
      { factor: "Elevated Cholesterol Level", description: "Serum cholesterol of 245 mg/dl.", severity: "moderate" },
      { factor: "Borderline Blood Pressure", description: "Resting BP of 135 mm Hg.", severity: "moderate" }
    ],
    recommendations: [
      { items: ["Moderate aerobic activity 30 mins daily", "Reduce dietary saturated fats", "Annual cardiac checkup"] }
    ]
  },
  {
    predictionId: "LSAI-2026-MR02",
    name: "Rahul Sharma",
    age: 50,
    gender: "M",
    contact: "9723456789",
    height: 176,
    weight: 74,
    bmi: 23.9,
    features: {
      Age: 50,
      Sex: "M",
      ChestPainType: "NAP",
      RestingBP: 130,
      Cholesterol: 230,
      FastingBS: 0,
      RestingECG: "Normal",
      MaxHR: 140,
      ExerciseAngina: "N",
      Oldpeak: 1.0,
      ST_Slope: "Flat"
    },
    prediction: 0,
    risk_percentage: 48.2,
    risk_category: "Moderate Risk",
    createdAt: "2026-08-25T16:00:00.000Z",
    clinical_factors: [
      { factor: "Elevated Cholesterol Level", description: "Serum cholesterol of 230 mg/dl.", severity: "moderate" }
    ],
    recommendations: [
      { items: ["Adopt balanced high-fiber diet", "Regular physical activity", "Routine BP and cholesterol monitoring"] }
    ]
  },
  {
    predictionId: "LSAI-2026-MR03",
    name: "Priya Verma",
    age: 52,
    gender: "F",
    contact: "9734567890",
    height: 162,
    weight: 64,
    bmi: 24.4,
    features: {
      Age: 52,
      Sex: "F",
      ChestPainType: "ATA",
      RestingBP: 128,
      Cholesterol: 238,
      FastingBS: 0,
      RestingECG: "Normal",
      MaxHR: 145,
      ExerciseAngina: "N",
      Oldpeak: 0.8,
      ST_Slope: "Flat"
    },
    prediction: 0,
    risk_percentage: 41.5,
    risk_category: "Moderate Risk",
    createdAt: "2026-08-22T10:10:00.000Z",
    clinical_factors: [
      { factor: "Elevated Cholesterol Level", description: "Serum cholesterol of 238 mg/dl.", severity: "moderate" }
    ],
    recommendations: [
      { items: ["Maintain low-cholesterol diet", "Engage in daily walking or yoga", "Routine health screening"] }
    ]
  },
  {
    predictionId: "LSAI-2026-LR01",
    name: "Neha Gupta",
    age: 45,
    gender: "F",
    contact: "9112345678",
    height: 160,
    weight: 58,
    bmi: 22.7,
    features: {
      Age: 45,
      Sex: "F",
      ChestPainType: "ATA",
      RestingBP: 122,
      Cholesterol: 205,
      FastingBS: 0,
      RestingECG: "Normal",
      MaxHR: 155,
      ExerciseAngina: "N",
      Oldpeak: 0.4,
      ST_Slope: "Up"
    },
    prediction: 0,
    risk_percentage: 18.2,
    risk_category: "Low Risk",
    createdAt: "2026-08-20T12:30:00.000Z",
    clinical_factors: [],
    recommendations: [
      { items: ["Maintain healthy lifestyle", "Annual preventive health checkup", "Balanced nutritious diet"] }
    ]
  },
  {
    predictionId: "LSAI-2026-LR02",
    name: "Amit Singh",
    age: 39,
    gender: "M",
    contact: "9123456789",
    height: 174,
    weight: 70,
    bmi: 23.1,
    features: {
      Age: 39,
      Sex: "M",
      ChestPainType: "ATA",
      RestingBP: 118,
      Cholesterol: 190,
      FastingBS: 0,
      RestingECG: "Normal",
      MaxHR: 160,
      ExerciseAngina: "N",
      Oldpeak: 0.0,
      ST_Slope: "Up"
    },
    prediction: 0,
    risk_percentage: 12.6,
    risk_category: "Low Risk",
    createdAt: "2026-08-18T15:45:00.000Z",
    clinical_factors: [],
    recommendations: [
      { items: ["Continue regular cardiovascular exercise", "Maintain healthy weight", "Hydrate adequately"] }
    ]
  },
  {
    predictionId: "LSAI-2026-LR03",
    name: "Rohit Mehta",
    age: 34,
    gender: "M",
    contact: "9134567890",
    height: 178,
    weight: 72,
    bmi: 22.7,
    features: {
      Age: 34,
      Sex: "M",
      ChestPainType: "ATA",
      RestingBP: 115,
      Cholesterol: 185,
      FastingBS: 0,
      RestingECG: "Normal",
      MaxHR: 168,
      ExerciseAngina: "N",
      Oldpeak: 0.0,
      ST_Slope: "Up"
    },
    prediction: 0,
    risk_percentage: 8.4,
    risk_category: "Low Risk",
    createdAt: "2026-08-15T09:20:00.000Z",
    clinical_factors: [],
    recommendations: [
      { items: ["Continue active lifestyle", "Balanced home-cooked diet", "Periodic routine health monitoring"] }
    ]
  },
  {
    predictionId: "LSAI-2026-LR04",
    name: "Ananya Patel",
    age: 29,
    gender: "F",
    contact: "9145678901",
    height: 165,
    weight: 55,
    bmi: 20.2,
    features: {
      Age: 29,
      Sex: "F",
      ChestPainType: "ATA",
      RestingBP: 110,
      Cholesterol: 175,
      FastingBS: 0,
      RestingECG: "Normal",
      MaxHR: 175,
      ExerciseAngina: "N",
      Oldpeak: 0.0,
      ST_Slope: "Up"
    },
    prediction: 0,
    risk_percentage: 4.5,
    risk_category: "Low Risk",
    createdAt: "2026-08-12T11:00:00.000Z",
    clinical_factors: [],
    recommendations: [
      { items: ["Maintain active daily exercise routine", "Healthy balanced diet", "Annual preventive checkups"] }
    ]
  }
];
