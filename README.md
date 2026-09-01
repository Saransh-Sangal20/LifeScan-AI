# LifeScan AI: Heart Failure Detection System

**A Complete Full-Stack Clinical Decision Support System for Heart Failure Detection and Patient Risk Stratification.**

Developed as a Prototype for a Final Year Major Project.

---

## 🏥 Architecture Overview

```text
LifeScan AI Architecture:
┌─────────────────────────────────────────────────────────────────────────┐
│ React Frontend (Vite + Tailwind CSS + Framer Motion + Recharts)         │
│ Ports: http://localhost:5173                                            │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ REST API (JSON)
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ Node.js & Express.js Backend (Clinical Triage & Storage Logic)          │
│ Port: http://localhost:5001/api                                         │
└─────────────────┬───────────────────────────────────────┬───────────────┘
                  │ Forward features                      │ CRUD
                  ▼                                       ▼
┌────────────────────────────────────┐ ┌──────────────────────────────────┐
│ Python Flask ML Microservice       │ │ MongoDB / Local Fallback Storage │
│ (Random Forest Classifier)         │ │ (Patient records & triage queue) │
│ Port: http://localhost:5000/predict│ └──────────────────────────────────┘
└────────────────────────────────────┘
```

---

## 📁 Project Structure

```text
LifeScan AI/
├── 1lifescan_ai_system.py   # Original ML pipeline & research training notebook
├── heart.csv                # Dataset (6,200 records)
├── start_system.py          # Unified single-command launcher for all 3 tiers
├── README.md                # System documentation
│
├── ml-service/              # Python Flask ML Microservice
│   ├── app.py               # Flask prediction server (Port 5000)
│   ├── heart_disease_model.pkl # Trained Random Forest Model
│   ├── feature_scaler.pkl   # Fitted StandardScaler
│   ├── label_encoders.pkl   # Fitted LabelEncoders dictionary
│   ├── requirements.txt     # Clean ML production dependencies
│   └── README.md            # ML service documentation
│
├── backend/                 # Node.js + Express API Backend (Port 5001)
│   ├── server.js            # Express server entry point
│   ├── routes/              # Express route handlers (/api/predict, /api/patients, /api/analytics)
│   ├── controllers/         # Prediction pipeline & CRUD controllers
│   ├── models/              # Mongoose Patient schema
│   ├── utils/               # Clinical logic engine & hybrid storage adapter
│   ├── data/                # Local persistent storage (patients.json)
│   ├── package.json         # Node.js dependencies
│   └── .env                 # Environment variables
│
└── frontend/                # React.js + Tailwind CSS Web Application (Port 5173)
    ├── src/
    │   ├── components/      # Navbar, Footer, RiskGauge, ClinicalFactors, Recommendations, StatCard
    │   ├── pages/           # LandingPage, Dashboard, AddPatient, PredictionReport, PatientHistory, Analytics
    │   ├── services/        # Axios API client
    │   ├── utils/           # PDF export & clinical rules
    │   ├── App.jsx          # React Router navigation
    │   ├── main.jsx         # React DOM root
    │   └── index.css        # Tailwind & Glassmorphism design tokens
    ├── tailwind.config.js   # Custom medical theme colors
    └── package.json         # React & UI dependencies
```

---

## ⚡ Quick Start — Run the Entire System

### Method 1: Single-Command Python Launcher
Run all 3 services simultaneously with a single command:

```bash
python start_system.py
```

### Method 2: Manual Terminal Startup

#### 1. Start the Flask ML Service (Port 5000)
```bash
cd ml-service
pip install -r requirements.txt
python app.py
```

#### 2. Start the Express Backend (Port 5001)
```bash
cd backend
npm install
npm start
```

#### 3. Start the React Frontend (Port 5173)
```bash
cd frontend
npm install
npm run dev
```

Visit the application in your browser at: **`http://localhost:5173`**

---

## 🌟 Key Application Features

### 1. Landing Page (`/`)
- Modern healthcare UI theme with Blue, White, and Teal glassmorphism aesthetics.
- Interactive live ML prediction preview widget.
- 4-Step diagnostic pipeline explanation.
- System architecture & technology breakdown.

### 2. Clinical Dashboard (`/dashboard`)
- KPI summary cards (Total Patients, High Risk 🔴, Moderate Risk 🟡, Low Risk 🟢, Average Risk Score).
- Quick triage list of recent patient screenings.
- System status monitor tracking the live ML service and database.

### 3. Patient Diagnostic Entry (`/add-patient`)
- Collects patient demographics (Name, Age, Gender, Contact, Height, Weight with live BMI calculation).
- 11 Cardiovascular biometric inputs (`Age`, `Sex`, `ChestPainType`, `RestingBP`, `Cholesterol`, `FastingBS`, `RestingECG`, `MaxHR`, `ExerciseAngina`, `Oldpeak`, `ST_Slope`).
- **1-Click Sample Profile Loaders** (High-Risk, Moderate-Risk, Low-Risk presets) for instant demonstration.

### 4. Prediction Report Page (`/report/:id`)
- Hospital-style clinical diagnostic report.
- Circular SVG risk gauge with dynamic color tiers.
- **Possible Contributing Clinical Factors** derived from the patient's submitted metrics.
- **Personalized Health & Wellness Recommendations** structured as actionable checklists.
- **Executive AI Clinical Summary** paragraph.
- **Download PDF Report** function with physician signature block and medical disclaimer.

### 5. Patient Triage History (`/history`)
- **Priority Triage Sorting**: Highest-risk patients automatically appear at the top.
- Live search by patient name.
- Filter by risk level (All, High Risk, Moderate Risk, Low Risk).
- View full reports and delete records.

### 6. Population Risk Analytics (`/analytics`)
- Interactive Recharts visualizations:
  - **Pie / Donut Chart**: Risk tier distribution across all patients.
  - **Bar Chart**: Top high-risk patients.
  - **Area Chart**: Screening activity trends over time.
  - **Horizontal Bars**: Prevalence of specific clinical risk factors.

---

## 🔬 Model Selection & Metrics

Benchmarked across 6,200 patient records from `heart.csv`:

| Model | Accuracy | Precision | Recall (Priority 1) | F1-Score (Priority 2) | ROC-AUC | False Negatives |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Random Forest Classifier** | **96.37%** | **96.93%** | **96.50%** | **96.71%** | **99.22%** | **24** |
| **SVM (RBF Kernel)** | 91.13% | 92.11% | 91.84% | 91.97% | 97.11% | 56 |
| **Logistic Regression** | 85.40% | 88.55% | 84.55% | 86.50% | 93.16% | 106 |

---

## 🛡️ Medical & Academic Disclaimer
*This system is an AI-assisted clinical decision prototype developed for a College Major Project. It is intended solely for educational, research, and demonstration purposes, and must not be used as a substitute for professional medical diagnosis or clinical treatment.*
