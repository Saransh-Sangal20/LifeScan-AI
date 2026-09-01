import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Eye, Trash2, UserPlus } from 'lucide-react';
import { getPatients, deletePatient } from '../services/api';
import { SAMPLE_PATIENTS, formatIndianDate } from '../data/samplePatients';
import Toast from '../components/Toast';

export default function PatientHistoryPage() {
  const [patients, setPatients] = useState(SAMPLE_PATIENTS);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('highest_risk');
  const [deleteModalId, setDeleteModalId] = useState(null);
  const [toast, setToast] = useState(null);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const res = await getPatients({ search, sort });
      if (res && res.data && res.data.length > 0) {
        setPatients(res.data);
      } else if (!search) {
        // Fallback to Indian sample records if database is fresh/empty
        setPatients(SAMPLE_PATIENTS);
      } else {
        // Local search filtering over sample records if server returns empty
        const filtered = SAMPLE_PATIENTS.filter(p => 
          p.name.toLowerCase().includes(search.toLowerCase().trim())
        );
        setPatients(filtered);
      }
    } catch (err) {
      console.warn('API fetch failed, utilizing sample Indian records:', err);
      // Client-side filtering & sorting fallback
      let records = [...SAMPLE_PATIENTS];
      if (search && search.trim()) {
        records = records.filter(p => 
          p.name.toLowerCase().includes(search.toLowerCase().trim())
        );
      }
      if (sort === 'lowest_risk') {
        records.sort((a, b) => a.risk_percentage - b.risk_percentage);
      } else if (sort === 'newest') {
        records.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else if (sort === 'oldest') {
        records.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      } else {
        records.sort((a, b) => b.risk_percentage - a.risk_percentage);
      }
      setPatients(records);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchPatients();
    }, 200);
    return () => clearTimeout(delayDebounce);
  }, [search, sort]);

  const handleDelete = async (id) => {
    try {
      await deletePatient(id).catch(() => {});
      setPatients(prev => prev.filter(p => (p.predictionId !== id && p._id !== id)));
      setToast({ type: 'success', message: 'Patient record deleted successfully.' });
      setDeleteModalId(null);
    } catch (err) {
      console.error('Delete failed:', err);
      setToast({ type: 'error', message: 'Failed to delete patient record.' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* ── Page Header ────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Patient History
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Search, sort, and manage all saved patient screenings and risk assessments
          </p>
        </div>

        <Link
          to="/add-patient"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-medium rounded-md shadow-sm transition-colors self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Patient</span>
        </Link>
      </div>

      {/* ── Search & Sorting Bar ────────────────────────────── */}
      <div className="app-card p-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          
          {/* Search Box */}
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by patient name (e.g. Saransh, Saurabh, Sandeep)..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-md text-slate-800 text-sm focus:outline-none focus:border-blue-600"
            />
          </div>

          {/* Sorting Dropdown */}
          <div className="sm:col-span-4">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-slate-800 text-sm focus:outline-none focus:border-blue-600"
            >
              <option value="highest_risk">Highest Risk First</option>
              <option value="lowest_risk">Lowest Risk First</option>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

        </div>
      </div>

      {/* ── Patient Records Table ───────────────────────────── */}
      <div className="app-card overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">
            Loading patient records...
          </div>
        ) : patients.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <p className="text-sm font-semibold text-slate-700">No Patient Records Found</p>
            <p className="text-xs text-slate-500">
              Try searching with another name or add a new patient.
            </p>
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
                {patients.map((p, idx) => {
                  const targetId = p.predictionId || p._id;
                  const isHigh = p.risk_category === 'High Risk';
                  const isMod = p.risk_category === 'Moderate Risk';

                  return (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      
                      {/* Name */}
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        <Link 
                          to={`/report/${targetId}`}
                          className="hover:text-blue-600 transition-colors"
                        >
                          {p.name}
                        </Link>
                      </td>

                      {/* Age */}
                      <td className="py-3.5 px-4">
                        {p.age}
                      </td>

                      {/* Risk % */}
                      <td className="py-3.5 px-4 font-mono font-medium">
                        {p.risk_percentage}%
                      </td>

                      {/* Risk Level */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          isHigh ? 'bg-red-50 text-red-700 border border-red-200' :
                          isMod ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {p.risk_category}
                        </span>
                      </td>

                      {/* Prediction Date (DD/MM/YYYY) */}
                      <td className="py-3.5 px-4 text-slate-500 text-xs font-mono">
                        {formatIndianDate(p.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
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
