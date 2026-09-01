import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  ArrowRight, 
  UserPlus, 
  Cpu, 
  FileText, 
  Database, 
  Activity, 
  History, 
  CheckCircle2 
} from 'lucide-react';

export default function LandingPage() {
  const steps = [
    {
      number: '1',
      title: 'Enter Patient Information',
      description: 'Fill in patient demographics and standard clinical measurements such as blood pressure, cholesterol, and ECG parameters.',
      icon: UserPlus
    },
    {
      number: '2',
      title: 'Machine Learning Prediction',
      description: 'The machine learning model analyzes the entered clinical parameters to estimate heart failure risk.',
      icon: Cpu
    },
    {
      number: '3',
      title: 'Generate Patient Report',
      description: 'Receive an instant risk assessment report with contributing clinical observations and health recommendations.',
      icon: FileText
    },
    {
      number: '4',
      title: 'Store Patient Record',
      description: 'Patient records and predictions are saved securely in the database for tracking and review.',
      icon: Database
    }
  ];

  const features = [
    {
      title: 'Heart Risk Prediction',
      description: 'Estimates heart failure risk probability based on clinical test measurements.',
      icon: Heart
    },
    {
      title: 'Patient Record Management',
      description: 'Store and manage patient records with full clinical parameter history.',
      icon: Database
    },
    {
      title: 'Clinical Report',
      description: 'Generates printable reports displaying risk category, indicators, and recommendations.',
      icon: FileText
    },
    {
      title: 'Prediction History',
      description: 'Search, filter, and sort past patient screenings by date or risk severity.',
      icon: History
    }
  ];

  return (
    <div className="space-y-12 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* ── HERO SECTION ─────────────────────────────────── */}
      <section className="app-card p-6 sm:p-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Left Hero Content */}
          <div className="md:col-span-7 space-y-4">
            <span className="inline-block text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded">
              Clinical Assessment Tool
            </span>
            
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              LifeScan AI
            </h1>
            
            <h2 className="text-lg sm:text-xl font-medium text-slate-700">
              Heart Failure Detection System
            </h2>
            
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
              An AI-assisted web application for estimating heart failure risk using patient clinical information.
            </p>

            <div className="pt-2">
              <Link
                to="/add-patient"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors"
              >
                <span>Start Screening</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Medical Illustration */}
          <div className="md:col-span-5 flex items-center justify-center">
            <div className="w-full max-w-sm p-6 bg-slate-50 border border-slate-200 rounded-lg flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-20 h-20 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600">
                <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  <path d="M3.22 12H9.5l1.5-3 2 6 1.5-3h4.78" />
                </svg>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-semibold text-slate-800">Cardiovascular Screening</div>
                <div className="text-xs text-slate-500">11 Clinical Parameters Evaluation</div>
              </div>
              <div className="w-full border-t border-slate-200 pt-3 flex items-center justify-around text-xs text-slate-600">
                <span>Resting BP</span>
                <span>•</span>
                <span>Cholesterol</span>
                <span>•</span>
                <span>Max HR</span>
                <span>•</span>
                <span>ECG</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────── */}
      <section className="space-y-6">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-xl font-bold text-slate-900">
            How It Works
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Four simple steps from clinical data entry to record storage
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div key={idx} className="app-card p-5 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      Step {s.number}
                    </span>
                    <Icon className="w-4 h-4 text-slate-500" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">
                    {s.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {s.description}
                  </p>
                </div>
                {idx < 3 && (
                  <div className="hidden md:block pt-2 text-slate-300 text-right text-xs">
                    ↓
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────── */}
      <section className="space-y-6">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-xl font-bold text-slate-900">
            Features
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Core capabilities designed for patient screening
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div key={idx} className="app-card p-5 space-y-2.5">
                <div className="w-8 h-8 rounded-md bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">
                  {f.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {f.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
