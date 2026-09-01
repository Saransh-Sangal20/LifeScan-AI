# LifeScan AI — Machine Learning Prediction Microservice

A production-ready Flask Machine Learning microservice for **LifeScan AI: Heart Failure Detection System**.

This service loads a pre-trained **Random Forest Classifier** along with its fitted preprocessing artifacts (`StandardScaler` and `LabelEncoder`s) once at startup to provide low-latency, real-time heart disease risk assessments.

---

## 📁 Directory Structure

```text
ml-service/
├── app.py                  # Flask API server & inference pipeline
├── heart_disease_model.pkl # Trained Random Forest model (joblib)
├── feature_scaler.pkl      # Fitted StandardScaler (joblib)
├── label_encoders.pkl      # Fitted LabelEncoders dictionary (joblib)
├── requirements.txt        # Production Python dependencies
└── README.md               # Documentation and integration guide
```

---

## ⚙️ Model Selection & Clinical Rationale

The model was selected after rigorous benchmarking across **Accuracy, Precision, Recall, and F1-Score** on the Heart Failure dataset:

| Model | Accuracy | Precision | Recall (Priority 1) | F1-Score (Priority 2) | ROC-AUC | False Negatives |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Random Forest Classifier** | **96.37%** | **96.93%** | **96.50%** | **96.71%** | **99.22%** | **24** |
| **SVM (RBF Kernel)** | 91.13% | 92.11% | 91.84% | 91.97% | 97.11% | 56 |
| **Logistic Regression** | 85.40% | 88.55% | 84.55% | 86.50% | 93.16% | 106 |

### Why Random Forest Was Selected:
1. **Clinical Safety (Highest Recall - 96.50%)**: Minimizes False Negatives (only 24 missed cases out of 686 positive test samples). In cardiovascular screening, missing an at-risk patient is dangerous.
2. **Top F1-Score (96.71%) & Precision (96.93%)**: Excellent balance without raising excessive false alarms.
3. **Probability Output (`predict_proba`)**: Yields calibrated risk confidence percentages for clinical risk tiering (`Low`, `Moderate`, `High`).

---

## 🚀 Setup & Installation

### 1. Prerequisites
- Python 3.9+ (Python 3.10, 3.11, 3.12, 3.13 supported)
- pip package manager

### 2. Create Virtual Environment
Navigate to the `ml-service` directory and create a virtual environment:

```bash
cd ml-service
python -m venv venv
```

Activate the environment:
- **Windows (PowerShell):**
  ```powershell
  .\venv\Scripts\Activate.ps1
  ```
- **Windows (Command Prompt):**
  ```cmd
  .\venv\Scripts\activate.bat
  ```
- **macOS / Linux:**
  ```bash
  source venv/bin/activate
  ```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

---

## 🏃 Running the Service

### Development Mode (Flask)
```bash
python app.py
```
*The server will start at `http://localhost:5000` (or the port specified by the `PORT` environment variable).*

### Production Mode (Gunicorn - Linux / Production Server)
```bash
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

---

## 🔌 API Reference

### 1. Health Check Endpoint
Check if the service is running and all model artifacts are properly loaded in memory.

- **URL:** `GET /health`
- **Response (200 OK):**
```json
{
  "status": "healthy",
  "model_loaded": true,
  "scaler_loaded": true,
  "encoders_loaded": true,
  "model_type": "RandomForestClassifier"
}
```

---

### 2. Heart Disease Prediction Endpoint
Submit patient health metrics to get an immediate prediction and risk analysis.

- **URL:** `POST /predict`
- **Headers:** `Content-Type: application/json`

#### Feature Specification Table

| Feature Name | Type | Valid Range / Allowed Values | Description | Example |
| :--- | :--- | :--- | :--- | :--- |
| `Age` | Integer | `1` to `120` | Patient's age in years | `65` |
| `Sex` | String | `"M"`, `"F"` | Biological sex (Male / Female) | `"M"` |
| `ChestPainType` | String | `"ASY"`, `"ATA"`, `"NAP"`, `"TA"` | ASY: Asymptomatic, ATA: Atypical Angina, NAP: Non-Anginal, TA: Typical Angina | `"ASY"` |
| `RestingBP` | Float | `40` to `300` | Resting blood pressure (mm Hg) | `145` |
| `Cholesterol` | Float | `0` to `700` | Serum cholesterol (mm/dl) | `289` |
| `FastingBS` | Integer / Boolean | `0` or `1` (or `false`/`true`) | Fasting blood sugar > 120 mg/dl (1 = True, 0 = False) | `1` |
| `RestingECG` | String | `"Normal"`, `"LVH"`, `"ST"` | Resting electrocardiogram results | `"LVH"` |
| `MaxHR` | Float | `40` to `250` | Maximum heart rate achieved | `110` |
| `ExerciseAngina` | String | `"Y"`, `"N"` | Exercise-induced angina (Y = Yes, N = No) | `"Y"` |
| `Oldpeak` | Float | `-5.0` to `10.0` | ST depression induced by exercise | `2.5` |
| `ST_Slope` | String | `"Up"`, `"Flat"`, `"Down"` | Slope of the peak exercise ST segment | `"Flat"` |

---

### 📊 Risk Categorization Logic

The risk percentage is calculated from `model.predict_proba()` for the positive class (Heart Disease Present):

- **Low Risk:** `risk_percentage < 35.0%`
- **Moderate Risk:** `35.0% <= risk_percentage < 65.0%`
- **High Risk:** `risk_percentage >= 65.0%`

---

## 🧪 Sample Payloads & Responses

### Sample 1: High-Risk Patient

#### Request:
```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "Age": 65,
    "Sex": "M",
    "ChestPainType": "ASY",
    "RestingBP": 145,
    "Cholesterol": 289,
    "FastingBS": 1,
    "RestingECG": "LVH",
    "MaxHR": 110,
    "ExerciseAngina": "Y",
    "Oldpeak": 2.5,
    "ST_Slope": "Flat"
  }'
```

#### Response (`200 OK`):
```json
{
  "prediction": 1,
  "risk_category": "High Risk",
  "risk_percentage": 98.0
}
```

---

### Sample 2: Low-Risk Patient

#### Request:
```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "Age": 40,
    "Sex": "F",
    "ChestPainType": "ATA",
    "RestingBP": 118,
    "Cholesterol": 195,
    "FastingBS": 0,
    "RestingECG": "Normal",
    "MaxHR": 165,
    "ExerciseAngina": "N",
    "Oldpeak": 0.0,
    "ST_Slope": "Up"
  }'
```

#### Response (`200 OK`):
```json
{
  "prediction": 0,
  "risk_category": "Low Risk",
  "risk_percentage": 3.0
}
```

---

### Sample 3: Validation Error Example (Missing Fields)

#### Request:
```json
{
  "Age": 45,
  "Sex": "M"
}
```

#### Response (`400 Bad Request`):
```json
{
  "error": "Missing Required Fields",
  "message": "Payload is missing 9 required feature(s).",
  "missing_fields": [
    "ChestPainType",
    "RestingBP",
    "Cholesterol",
    "FastingBS",
    "RestingECG",
    "MaxHR",
    "ExerciseAngina",
    "Oldpeak",
    "ST_Slope"
  ]
}
```

---

### Sample 4: Validation Error Example (Invalid Category & Out-of-Range Value)

#### Request:
```json
{
  "Age": 150,
  "Sex": "Unknown",
  "ChestPainType": "ASY",
  "RestingBP": 145,
  "Cholesterol": 289,
  "FastingBS": 1,
  "RestingECG": "LVH",
  "MaxHR": 110,
  "ExerciseAngina": "Y",
  "Oldpeak": 2.5,
  "ST_Slope": "Flat"
}
```

#### Response (`400 Bad Request`):
```json
{
  "error": "Input Validation Failed",
  "message": "One or more input fields failed validation.",
  "details": [
    {
      "field": "Sex",
      "error": "Invalid category 'Unknown'.",
      "allowed_values": ["M", "F"]
    },
    {
      "field": "Age",
      "error": "Value 150 is out of acceptable clinical range [1, 120]."
    }
  ]
}
```

---

## 🌐 Frontend / Backend Integration Guide

### 1. Node.js / Express Backend Call
```javascript
const axios = require('axios');

async function checkHeartDiseaseRisk(patientData) {
  try {
    const response = await axios.post('http://localhost:5000/predict', patientData);
    console.log('Prediction:', response.data.prediction);
    console.log('Risk Category:', response.data.risk_category);
    console.log('Risk Percentage:', response.data.risk_percentage);
    return response.data;
  } catch (error) {
    console.error('Prediction API Error:', error.response ? error.response.data : error.message);
    throw error;
  }
}
```

### 2. React Frontend Call
```javascript
import React, { useState } from 'react';

export function PredictForm() {
  const [result, setResult] = useState(null);

  const handlePredict = async (formData) => {
    const response = await fetch('http://localhost:5000/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const data = await response.json();
    setResult(data);
  };

  return (
    <div>
      {/* Form Inputs */}
      {result && (
        <div className={`risk-badge ${result.risk_category.toLowerCase().replace(' ', '-')}`}>
          <h3>{result.risk_category} ({result.risk_percentage}%)</h3>
          <p>{result.prediction === 1 ? 'Heart Disease Detected' : 'No Heart Disease Detected'}</p>
        </div>
      )}
    </div>
  );
}
```
