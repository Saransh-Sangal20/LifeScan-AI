/**
 * LifeScan AI - Clinical Reasoning Engine
 * 
 * Implements deterministic clinical rule-based factor extraction,
 * personalized health recommendations, and structured AI summary generation.
 * 
 * Note: These clinical factors and recommendations are derived transparently
 * from the patient's entered biometric values and are clearly distinguished
 * from the statistical ML probability output.
 */

/**
 * Evaluates patient clinical factors based on medical guidelines.
 * @param {Object} patient - Patient data object
 * @returns {Array<{factor: string, description: string, severity: string}>}
 */
function deriveClinicalFactors(patient) {
  const factors = [];

  const age = Number(patient.Age);
  const restingBP = Number(patient.RestingBP);
  const cholesterol = Number(patient.Cholesterol);
  const fastingBS = Number(patient.FastingBS);
  const exerciseAngina = String(patient.ExerciseAngina).toUpperCase();
  const oldpeak = Number(patient.Oldpeak);
  const maxHR = Number(patient.MaxHR);
  const chestPainType = String(patient.ChestPainType).toUpperCase();
  const stSlope = String(patient.ST_Slope).toUpperCase();

  // Rule 1: Advanced Age (> 60)
  if (age > 60) {
    factors.push({
      factor: "Advanced Age",
      description: `Patient age (${age} years) increases cumulative cardiovascular vulnerability and vascular stiffness.`,
      severity: "moderate",
      icon: "UserCheck"
    });
  }

  // Rule 2: High Resting Blood Pressure (> 140)
  if (restingBP > 140) {
    factors.push({
      factor: "High Resting Blood Pressure",
      description: `Resting BP of ${restingBP} mm Hg indicates Stage 2 Hypertension, straining arterial walls and cardiac muscle.`,
      severity: "high",
      icon: "Activity"
    });
  }

  // Rule 3: Elevated Cholesterol (> 240)
  if (cholesterol > 240) {
    factors.push({
      factor: "Elevated Cholesterol Level",
      description: `Serum cholesterol of ${cholesterol} mg/dl suggests hypercholesterolemia, elevating atherosclerotic plaque risk.`,
      severity: "high",
      icon: "Droplet"
    });
  }

  // Rule 4: Elevated Blood Sugar (FastingBS == 1)
  if (fastingBS === 1) {
    factors.push({
      factor: "Elevated Blood Sugar",
      description: "Fasting blood sugar > 120 mg/dl is a metabolic risk marker correlating with microvascular complications.",
      severity: "moderate",
      icon: "Flame"
    });
  }

  // Rule 5: Exercise-Induced Angina (ExerciseAngina == 'Y')
  if (exerciseAngina === "Y") {
    factors.push({
      factor: "Exercise-Induced Angina",
      description: "Myocardial ischemia indicated by chest pain/discomfort triggered during physical exertion.",
      severity: "high",
      icon: "AlertTriangle"
    });
  }

  // Rule 6: Significant ST Depression (Oldpeak > 2)
  if (oldpeak > 2) {
    factors.push({
      factor: "Significant ST Depression",
      description: `ST depression of ${oldpeak} mm on ECG indicates exercise-induced myocardial ischemic strain.`,
      severity: "high",
      icon: "TrendingDown"
    });
  }

  // Rule 7: Reduced Maximum Heart Rate (MaxHR < 100)
  if (maxHR < 100) {
    factors.push({
      factor: "Reduced Maximum Heart Rate",
      description: `Peak achieved heart rate (${maxHR} bpm) reflects chronotropic incompetence or reduced cardiac reserve.`,
      severity: "moderate",
      icon: "HeartOff"
    });
  }

  // Rule 8: Asymptomatic Chest Pain Pattern (ChestPainType == 'ASY')
  if (chestPainType === "ASY") {
    factors.push({
      factor: "Asymptomatic Chest Pain Pattern",
      description: "Asymptomatic cardiac presentation is clinically associated with silent ischemia and advanced coronary disease.",
      severity: "high",
      icon: "ShieldAlert"
    });
  }

  // Supplementary Rule: Flat or Downward ST Slope
  if (stSlope === "FLAT" || stSlope === "DOWN") {
    factors.push({
      factor: `${stSlope === "DOWN" ? "Downsloping" : "Flat"} ST Segment Slope`,
      description: "Abnormal ST segment trajectory during exercise peak indicates impaired coronary perfusion.",
      severity: stSlope === "DOWN" ? "high" : "moderate",
      icon: "Zap"
    });
  }

  return factors;
}

/**
 * Generates personalized health recommendations based on patient findings.
 * @param {Object} patient - Patient data object
 * @param {string} riskCategory - 'High Risk' | 'Moderate Risk' | 'Low Risk'
 * @returns {Array<{category: string, title: string, recommendations: string[], icon: string}>}
 */
function generateRecommendations(patient, riskCategory) {
  const recommendations = [];

  const age = Number(patient.Age);
  const restingBP = Number(patient.RestingBP);
  const cholesterol = Number(patient.Cholesterol);
  const fastingBS = Number(patient.FastingBS);
  const exerciseAngina = String(patient.ExerciseAngina).toUpperCase();

  // High BP Recommendations
  if (restingBP > 130) {
    recommendations.push({
      category: "Blood Pressure Management",
      title: "Hypertension Control Protocol",
      icon: "Activity",
      color: "rose",
      items: [
        "Reduce dietary sodium intake (< 2,000 mg/day) by minimizing processed foods.",
        "Perform daily resting blood pressure monitoring (morning & evening log).",
        "Engage in at least 30 minutes of moderate aerobic walking 5 days per week."
      ]
    });
  }

  // High Cholesterol Recommendations
  if (cholesterol > 200) {
    recommendations.push({
      category: "Lipid & Dietary Optimization",
      title: "Cholesterol Lowering Strategy",
      icon: "Droplet",
      color: "amber",
      items: [
        "Adopt a Mediterranean-style low-fat diet rich in monounsaturated fats.",
        "Increase soluble dietary fiber intake (oats, flaxseeds, legumes, leafy greens).",
        "Avoid trans-fatty acids, deep-fried snacks, and ultra-processed dairy."
      ]
    });
  }

  // Blood Sugar Recommendations
  if (fastingBS === 1) {
    recommendations.push({
      category: "Glycemic Regulation",
      title: "Blood Glucose Stabilization",
      icon: "Flame",
      color: "orange",
      items: [
        "Limit refined sugars, sweetened beverages, and simple carbohydrate loads.",
        "Maintain routine fasting and HbA1c glucose monitoring under physician guidance.",
        "Combine mild resistance training with post-meal walking to enhance insulin sensitivity."
      ]
    });
  }

  // Exercise Angina / High Risk Cardiology Actions
  if (exerciseAngina === "Y" || riskCategory === "High Risk") {
    recommendations.push({
      category: "Cardiology Consultation",
      title: "Specialist Review & Workup",
      icon: "AlertCircle",
      color: "red",
      items: [
        "Consult a certified cardiologist for comprehensive stress echocardiography.",
        "Avoid sudden unmonitored strenuous physical exertion without medical clearance.",
        "Keep emergency cardiovascular contact information and prescribed medications on hand."
      ]
    });
  }

  // Age & Preventive Checkups
  if (age > 55 || recommendations.length === 0) {
    recommendations.push({
      category: "Preventive Cardiac Care",
      title: "Routine Longevity Protocol",
      icon: "Heart",
      color: "teal",
      items: [
        "Schedule periodic 12-lead resting ECG and comprehensive metabolic panels.",
        "Maintain adequate hydration (2-2.5 liters water daily unless restricted).",
        "Practice daily stress-reduction techniques and ensure 7-8 hours of restful sleep."
      ]
    });
  }

  return recommendations;
}

/**
 * Generates a concise, professional AI clinical summary.
 * @param {Object} patient
 * @param {number} riskPercentage
 * @param {string} riskCategory
 * @param {Array} clinicalFactors
 * @returns {string}
 */
function generateAISummary(patient, riskPercentage, riskCategory, clinicalFactors) {
  const patientName = patient.name || "The patient";
  const factorNames = clinicalFactors.map(f => f.factor.toLowerCase());

  let factorSentence = "";
  if (factorNames.length > 0) {
    if (factorNames.length === 1) {
      factorSentence = `${clinicalFactors[0].factor} is identified as a prominent contributing clinical factor.`;
    } else if (factorNames.length === 2) {
      factorSentence = `${clinicalFactors[0].factor} and ${clinicalFactors[1].factor} are identified as primary contributing clinical factors.`;
    } else {
      const topFactors = factorNames.slice(0, 3).join(", ");
      factorSentence = `${topFactors}, along with additional biometric markers, are identified as potential contributing clinical factors.`;
    }
  } else {
    factorSentence = "No acute biometric irregularities were flagged in the basic clinical features.";
  }

  let clinicalAction = "";
  if (riskCategory === "High Risk") {
    clinicalAction = "Immediate specialist consultation with a certified cardiologist, formal echocardiographic evaluation, and personalized therapeutic management are strongly recommended.";
  } else if (riskCategory === "Moderate Risk") {
    clinicalAction = "Proactive lifestyle modifications, routine cardiovascular monitoring, and follow-up screening are recommended to prevent risk progression.";
  } else {
    clinicalAction = "The patient is encouraged to maintain current healthy habits, regular physical activity, and standard preventive annual health screenings.";
  }

  return `${patientName}'s submitted clinical profile indicates an estimated ${riskPercentage}% risk of heart failure, placing them in the ${riskCategory} tier. ${factorSentence} ${clinicalAction}`;
}

module.exports = {
  deriveClinicalFactors,
  generateRecommendations,
  generateAISummary
};
