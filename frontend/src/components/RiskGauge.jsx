import React from 'react';

export default function RiskGauge({ percentage = 0, category = 'Low Risk' }) {
  const cleanPct = Math.min(100, Math.max(0, Number(percentage) || 0));

  let barColor = 'bg-emerald-600';
  let badgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200';

  if (category === 'High Risk' || cleanPct >= 65) {
    barColor = 'bg-red-600';
    badgeStyle = 'bg-red-50 text-red-700 border-red-200';
  } else if (category === 'Moderate Risk' || cleanPct >= 35) {
    barColor = 'bg-amber-500';
    badgeStyle = 'bg-amber-50 text-amber-700 border-amber-200';
  }

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-slate-900 font-mono">
            {cleanPct.toFixed(1)}%
          </span>
          <span className="text-xs text-slate-500">Estimated Heart Failure Risk</span>
        </div>
        <span className={`px-2.5 py-0.5 rounded text-xs font-semibold border ${badgeStyle}`}>
          {category}
        </span>
      </div>

      {/* Simple Colored Horizontal Progress Bar */}
      <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
        <div 
          className={`h-full ${barColor} transition-all duration-500`}
          style={{ width: `${cleanPct}%` }}
        />
      </div>

      <div className="flex justify-between text-[11px] text-slate-400 font-medium">
        <span>0% (Low)</span>
        <span>35% (Moderate)</span>
        <span>65% (High)</span>
        <span>100%</span>
      </div>
    </div>
  );
}
