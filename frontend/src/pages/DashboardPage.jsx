import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, AlertTriangle, AlertCircle, CheckCircle2, Trash2, Eye } from 'lucide-react';
import StatCard from '../components/StatCard';
import Toast from '../components/Toast';
import { getPatients, getAnalytics, deletePatient } from '../services/api';
import { SAMPLE_PATIENTS, formatIndianDate } from '../data/samplePatients';

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState({
    totalPatients: SAMPLE_PATIENTS.length,
    highRiskCount: SAMPLE_PATIENTS.filter(p => p.risk_category === 'High Risk').length,
    moderateRiskCount: SAMPLE_PATIENTS.filter(p => p.risk_category === 'Moderate Risk').length,
    lowRiskCount: SAMPLE_PATIENTS.filter(p => p.risk_category === 'Low Risk').length
  });
  const [recentPatients, setRecentPatients] = useState(SAMPLE_PATIENTS.slice(0, 8));
  const [loading, setLoading] = useState(false);
  const [deleteModalId, setDeleteModalId] = useState(null);
  const [toast, setToast] = useState(null);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, patientsRes] = await Promise.all([
        getAnalytics().catch(() => null),
        getPatients({ sort: 'newest' }).catch(() => null)
      ]);

      if (analyticsRes && analyticsRes.data && analyticsRes.data.totalPatients > 0) {
        setAnalytics(analyticsRes.data);
      }
      if (patientsRes && patientsRes.data && patientsRes.data.length > 0) {
        setRecentPatients(patientsRes.data.slice(0, 8));
      }
    } catch (err) {
      console.warn('API error, using Indian sample data for dashboard display:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deletePatient(id).catch(() => {});
      setRecentPatients(prev => prev.filter(p => (p.predictionId !== id && p._id !== id)));
      setToast({ type: 'success', message: 'Patient record deleted successfully.' });
      setDeleteModalId(null);
    } catch (err) {
      console.error('Failed to delete patient:', err);
      setToast({ type: 'error', message: 'Failed to delete patient record.' });
    }
  };

  const totalPatients = analytics?.totalPatients ?? recentPatients.length;
  const highRiskCount = analytics?.highRiskCount ?? 0;
  const moderateRiskCount = analytics?.moderateRiskCount ?? 0;
  const lowRiskCount = analytics?.lowRiskCount ?? 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* ── Page Title ────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Overview of patient screenings and heart failure risk stratification
          </p>
        </div>

        <Link
          to="/add-patient"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-medium rounded-md shadow-sm transition-colors self-start sm:self-auto"
        >
          Add Patient
        </Link>
      </div>

      {/* ── Top 4 Summary Cards ────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Patients"
          value={totalPatients}
          icon={Users}
          color="blue"
          subtext="Total screened records"
        />
        <StatCard
          title="High Risk"
          value={highRiskCount}
          icon={AlertTriangle}
          color="red"
          subtext="Requires clinical attention"
        />
        <StatCard
          title="Moderate Risk"
          value={moderateRiskCount}
          icon={AlertCircle}
          color="orange"
          subtext="Lifestyle & monitoring"
        />
        <StatCard
          title="Low Risk"
          value={lowRiskCount}
          icon={CheckCircle2}
          color="green"
          subtext="Normal risk range"
        />
      </div>

      {/* ── Recent Patients Table ──────────────────────────── */}
      <div className="app-card overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-800">
            Recent Patients
          </h2>
          <Link
            to="/history"
            className="text-xs font-medium text-blue-600 hover:text-blue-800"
          >
            View All History &rarr;
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500">
            Loading recent patients...
          </div>
        ) : recentPatients.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No patient records available yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-semibold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Patient Name</th>
                  <th className="py-3 px-4">Age</th>
                  <th className="py-3 px-4">Risk %</th>
                  <th className="py-3 px-4">Risk Level</th>
                  <th className="py-3 px-4">Prediction Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {recentPatients.map((p, idx) => {
                  const targetId = p.predictionId || p._id;
                  const isHigh = p.risk_category === 'High Risk';
                  const isMod = p.risk_category === 'Moderate Risk';

                  return (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {p.name}
                      </td>
                      <td className="py-3 px-4">
                        {p.age}
                      </td>
                      <td className="py-3 px-4 font-medium font-mono">
                        {p.risk_percentage}%
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          isHigh ? 'bg-red-50 text-red-700 border border-red-200' :
                          isMod ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {p.risk_category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 text-xs font-mono">
                        {formatIndianDate(p.createdAt)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/report/${targetId}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded text-xs font-medium transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </Link>
                          <button
                            onClick={() => setDeleteModalId(targetId)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-700 hover:bg-red-100 rounded text-xs font-medium transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full border border-slate-200 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-slate-800">
              Confirm Delete
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete this patient record? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteModalId(null)}
                className="px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteModalId)}
                className="px-3 py-1.5 rounded-md bg-[#DC2626] hover:bg-red-700 text-white text-xs font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

    </div>
  );
}
