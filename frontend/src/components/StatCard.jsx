import React from 'react';

export default function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  color = 'blue',
  subtext
}) {
  const colorMap = {
    blue: {
      badge: 'bg-blue-50 text-blue-700 border-blue-200',
      iconColor: 'text-blue-600'
    },
    red: {
      badge: 'bg-red-50 text-red-700 border-red-200',
      iconColor: 'text-red-600'
    },
    orange: {
      badge: 'bg-amber-50 text-amber-700 border-amber-200',
      iconColor: 'text-amber-600'
    },
    green: {
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      iconColor: 'text-emerald-600'
    }
  };

  const theme = colorMap[color] || colorMap.blue;

  return (
    <div className="app-card p-5 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
          {title}
        </span>
        {Icon && (
          <div className={`p-2 rounded-md ${theme.badge} border`}>
            <Icon className={`w-4 h-4 ${theme.iconColor}`} />
          </div>
        )}
      </div>

      <div>
        <div className="text-2xl font-bold text-slate-900">
          {value}
        </div>
        {subtext && (
          <p className="text-xs text-slate-500 mt-1">
            {subtext}
          </p>
        )}
      </div>
    </div>
  );
}
