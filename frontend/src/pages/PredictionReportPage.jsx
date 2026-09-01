import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, UserPlus, AlertCircle } from 'lucide-react';
import MedicalReportView from '../components/MedicalReportView';
import LoadingPulse from '../components/LoadingPulse';
import { getPatientById } from '../services/api';
import { SAMPLE_PATIENTS } from '../data/samplePatients';

export default function PredictionReportPage() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadReport() {
      try {
        setLoading(true);
        setError(null);
        
        let found = null;
        try {
          const res = await getPatientById(id);
          if (res && res.data) {
            found = res.data;
          }
        } catch (apiErr) {
          console.warn('API lookup failed, checking sample records:', apiErr);
        }

        // Check sample patients if not returned by server
        if (!found) {
          found = SAMPLE_PATIENTS.find(p => p.predictionId === id || p._id === id);
        }

        if (found) {
          setPatient(found);
        } else {
          setError(`The clinical record with ID '${id}' could not be located.`);
        }
      } catch (err) {
        console.error('Failed to load patient report:', err);
        setError(err.message || 'Unable to retrieve clinical report for this ID.');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadReport();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <LoadingPulse message="Loading patient clinical report..." />
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">
          Report Not Found
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          {error || `The clinical record with ID '${id}' could not be located.`}
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            to="/history"
            className="px-3.5 py-2 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
          >
            Patient History
          </Link>
          <Link
            to="/add-patient"
            className="px-3.5 py-2 rounded-md bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-medium transition-colors"
          >
            Add Patient
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Breadcrumb Navigation */}
      <div className="no-print flex items-center justify-between">
        <Link
          to="/history"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Patient History</span>
        </Link>

        <Link
          to="/add-patient"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-md text-xs font-medium transition-colors"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>New Screening</span>
        </Link>
      </div>

      {/* Hospital Report Main Component */}
      <MedicalReportView patient={patient} />

    </div>
  );
}
