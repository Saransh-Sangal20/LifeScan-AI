import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  PieChart as PieIcon, 
  TrendingUp, 
  Activity, 
  Users, 
  AlertTriangle, 
  ShieldCheck, 
  RefreshCw,
  Zap
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  LineChart, 
  Line, 
  AreaChart,
  Area
} from 'recharts';
import StatCard from '../components/StatCard';
import { getAnalytics } from '../services/api';

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true);
        const res = await getAnalytics();
        if (res && res.data) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-3">
        <RefreshCw className="w-8 h-8 text-brand-400 animate-spin mx-auto" />
        <p className="text-sm text-slate-400">Computing population analytics and risk distributions...</p>
      </div>
    );
  }

  const {
    totalPatients = 0,
    averageRisk = 0,
    highestRisk = 0,
    lowestRisk = 0,
    riskDistribution = [],
    topHighRiskPatients = [],
    predictionsOverTime = [],
    factorPrevalence = []
  } = data || {};

  // Custom Chart Tooltips
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl text-xs text-white space-y-1">
          <p className="font-bold text-brand-300">{label || payload[0].name}</p>
          <p className="text-slate-200">
            Value: <strong className="font-mono text-white">{payload[0].value}</strong> {payload[0].unit || ''}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* ── Page Header ────────────────────────────────────── */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-400">
          <BarChart3 className="w-4 h-4" />
          <span>Cardiovascular Epidemiological Insights</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white mt-1">
          Population Risk Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Statistical risk distributions, clinical factor prevalence, and predictive trends across screened cohorts
        </p>
      </div>

      {/* ── Summary Statistics Cards ───────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Predictions"
          value={totalPatients}
          icon={Users}
          color="brand"
          changeText="Screened"
          subtext="Total processed cohorts"
          delay={0}
        />
        <StatCard
          title="Cohort Mean Risk"
          value={`${averageRisk}%`}
          icon={Activity}
          color="teal"
          changeText="Mean"
          subtext="Average estimated probability"
          delay={0.1}
        />
        <StatCard
          title="Peak Risk Score"
          value={`${highestRisk}%`}
          icon={AlertTriangle}
          color="rose"
          changeText="Critical"
          subtext="Maximum recorded risk profile"
          delay={0.2}
        />
        <StatCard
          title="Baseline Low Risk"
          value={`${lowestRisk}%`}
          icon={ShieldCheck}
          color="emerald"
          changeText="Optimal"
          subtext="Lowest recorded risk score"
          delay={0.3}
        />
      </div>

      {/* ── Charts Grid Row 1: Pie / Donut & Top High Risk ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Risk Distribution Donut Chart (5 cols) */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-brand-400" />
              <h3 className="text-base font-bold font-display text-white">
                Risk Tier Stratification
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Proportion of cohort categorized into High, Moderate, and Low risk
            </p>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="name"
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value) => <span className="text-xs text-slate-300 font-medium">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Breakdown Badges */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center">
            {riskDistribution.map((item, i) => (
              <div key={i} className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-semibold">{item.name}</span>
                <span className="text-sm font-bold text-white font-mono">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top High Risk Patients Bar Chart (7 cols) */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <h3 className="text-base font-bold font-display text-white">
                Top High-Risk Patients Requiring Immediate Triage
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Patients ranked by highest calculated probability of heart failure
            </p>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topHighRiskPatients} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis 
                  dataKey="name" 
                  stroke="#94a3b8" 
                  tick={{ fontSize: 11 }} 
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="risk_percentage" 
                  name="Risk Score (%)"
                  fill="#ef4444" 
                  radius={[8, 8, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
            <span>Critical Triage Cutoff: <strong>≥ 65.0% Risk</strong></span>
            <span className="text-rose-400 font-semibold font-mono">Priority Care Flagged</span>
          </div>
        </div>

      </div>

      {/* ── Charts Grid Row 2: Timeline & Factor Prevalence ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Screening Trend Area Chart (6 cols) */}
        <div className="lg:col-span-6 glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-teal-400" />
              <h3 className="text-base font-bold font-display text-white">
                Diagnostic Screening Activity
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Cumulative patient screening volume recorded over time
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={predictionsOverTime} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  name="Screenings" 
                  stroke="#0ea5e9" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorCount)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Clinical Risk Factor Prevalence Horizontal Bars (6 cols) */}
        <div className="lg:col-span-6 glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <h3 className="text-base font-bold font-display text-white">
                Prevalence of Clinical Risk Indicators
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Frequency of specific biometric markers across all evaluated patients
            </p>
          </div>

          <div className="space-y-3 pt-1">
            {factorPrevalence.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">No clinical risk factor data available.</p>
            ) : (
              factorPrevalence.slice(0, 5).map((f, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{f.factor}</span>
                    <span className="font-mono text-slate-400">{f.percentage}% ({f.count} patients)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, f.percentage)}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Derived via Deterministic Clinical Rules</span>
            <span className="text-brand-300">Cohort Matrix</span>
          </div>
        </div>

      </div>

    </div>
  );
}
