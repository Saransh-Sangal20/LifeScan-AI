import React from 'react';
import { Printer, Download, Heart } from 'lucide-react';
import RiskGauge from './RiskGauge';
import ClinicalFactorsCard from './ClinicalFactorsCard';
import RecommendationsCard from './RecommendationsCard';
import { exportReportToPDF } from '../utils/pdfExport';
import { formatIndianDate } from '../data/samplePatients';

export default function MedicalReportView({ patient }) {
  if (!patient) return null;

  const {
    predictionId = 'LSAI-001',
    name = 'Rahul Sharma',
    age = 0,
    gender = 'M',
    contact = '',
    height,
    weight,
    bmi,
    features = {},
    prediction = 0,
    risk_percentage = 0,
    risk_category = 'Low Risk',
    clinical_factors = [],
    recommendations = [],
    createdAt = new Date().toISOString()
  } = patient;

  const formattedDate = formatIndianDate(createdAt);

  const handleDownloadPDF = () => {
    exportReportToPDF('hospital-report-content', `LifeScan_Report_${predictionId}.pdf`);
  };

  const handlePrint = () => {
    window.print();
  };

  const featureDefinitions = [
    { label: 'Resting Blood Pressure', val: `${features.RestingBP ?? '—'} mm Hg`, ref: '< 120 mm Hg' },
    { label: 'Serum Cholesterol', val: `${features.Cholesterol ?? '—'} mg/dl`, ref: '< 200 mg/dl' },
    { label: 'Fasting Blood Sugar', val: features.FastingBS === 1 ? '> 120 mg/dl (Elevated)' : '≤ 120 mg/dl (Normal)', ref: '≤ 120 mg/dl' },
    { label: 'Resting ECG', val: features.RestingECG || 'Normal', ref: 'Normal / LVH / ST' },
    { label: 'Max Heart Rate', val: `${features.MaxHR ?? '—'} bpm`, ref: '60 – 200 bpm' },
    { label: 'Chest Pain Type', val: features.ChestPainType || '—', ref: 'ASY / ATA / NAP / TA' },
    { label: 'Exercise Induced Angina', val: features.ExerciseAngina === 'Y' ? 'Yes (Present)' : 'No (Absent)', ref: 'No (Absent)' },
    { label: 'ST Depression (Oldpeak)', val: `${features.Oldpeak ?? '—'} mm`, ref: '0.0 mm' },
    { label: 'Peak ST Slope', val: features.ST_Slope || '—', ref: 'Up / Flat / Down' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Action Bar (No-Print) */}
      <div className="no-print flex flex-wrap items-center justify-between gap-4 p-4 app-card">
        <div className="text-xs text-slate-500">
          Report ID: <span className="font-mono font-semibold text-slate-800">{predictionId}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-medium transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-md text-xs font-medium shadow-sm transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Main Printable Hospital Report Container */}
      <div 
        id="hospital-report-content" 
        className="medical-report-container bg-white border border-slate-200 rounded-lg p-6 sm:p-8 space-y-6 text-slate-800 shadow-sm"
      >
        
        {/* Report Header */}
        <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-[#2563EB] text-white flex items-center justify-center">
              <Heart className="w-6 h-6 fill-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                LifeScan AI
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Heart Failure Detection System &bull; Patient Assessment Report
              </p>
            </div>
          </div>

          <div className="text-xs text-slate-500 font-mono text-left sm:text-right">
            <div><strong>Report ID:</strong> {predictionId}</div>
            <div><strong>Date:</strong> {formattedDate}</div>
          </div>
        </div>

        {/* Patient Details */}
        <div className="bg-slate-50 border border-slate-200 rounded-md p-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-500 block">Patient Name</span>
              <span className="font-bold text-slate-900 text-sm">{name}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Age</span>
              <span className="font-semibold text-slate-800">{age} years</span>
            </div>
            <div>
              <span className="text-slate-500 block">Gender</span>
              <span className="font-semibold text-slate-800">{gender === 'M' ? 'Male' : 'Female'}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Phone</span>
              <span className="font-semibold text-slate-800">{contact || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Prediction Result & Risk Assessment */}
        <div className="bg-slate-50 border border-slate-200 rounded-md p-5 space-y-3">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
            Risk Assessment Result
          </h2>
          <RiskGauge percentage={risk_percentage} category={risk_category} />
        </div>

        {/* Clinical Parameters Table */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-slate-800">
            Recorded Clinical Parameters
          </h3>
          <div className="overflow-x-auto border border-slate-200 rounded-md">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Parameter</th>
                  <th className="py-2.5 px-3 font-semibold">Patient Value</th>
                  <th className="py-2.5 px-3 font-semibold">Normal Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {featureDefinitions.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60">
                    <td className="py-2 px-3 font-medium">{item.label}</td>
                    <td className="py-2 px-3 font-semibold text-slate-900 font-mono">{item.val}</td>
                    <td className="py-2 px-3 text-slate-500">{item.ref}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Clinical Factors */}
        <ClinicalFactorsCard factors={clinical_factors} />

        {/* Recommendations */}
        <RecommendationsCard recommendations={recommendations} />

        {/* Disclaimer (Mandatory at bottom of report) */}
        <div className="pt-4 border-t border-slate-200">
          <p className="text-xs text-slate-500 leading-relaxed">
            <strong className="text-slate-700">Disclaimer:</strong> This prediction is generated using a machine learning model and is intended to assist clinical assessment. It should not replace professional medical judgment.
          </p>
        </div>

      </div>
    </div>
  );
}
