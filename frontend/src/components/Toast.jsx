import React from 'react';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';

export default function Toast({ type = 'success', message, onClose }) {
  if (!message) return null;

  const isSuccess = type === 'success';
  const isError = type === 'error';

  let borderStyle = 'border-blue-300 text-blue-900 bg-white';
  let Icon = Info;
  let iconColor = 'text-blue-600';

  if (isSuccess) {
    borderStyle = 'border-emerald-300 text-emerald-900 bg-white';
    Icon = CheckCircle2;
    iconColor = 'text-emerald-600';
  } else if (isError) {
    borderStyle = 'border-red-300 text-red-900 bg-white';
    Icon = AlertCircle;
    iconColor = 'text-red-600';
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm">
      <div className={`flex items-center gap-2.5 px-4 py-3 rounded-md border shadow-md ${borderStyle}`}>
        <Icon className={`w-4 h-4 shrink-0 ${iconColor}`} />
        <div className="flex-1 text-xs font-medium">
          {message}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
