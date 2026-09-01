import React from 'react';

export default function ClinicalFactorsCard({ factors = [] }) {
  return (
    <div className="app-card p-6 space-y-4">
      <div>
        <h3 className="text-base font-bold text-slate-900">
          Possible Contributing Clinical Factors
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Clinical factors identified from entered measurements
        </p>
      </div>

      {/* Bullet List of Factors */}
      {factors.length === 0 ? (
        <p className="text-xs text-slate-600 italic">
          No significant contributing clinical risk factors flagged based on the entered values.
        </p>
      ) : (
        <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
          {factors.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-blue-600 font-bold text-base leading-none mt-0.5">•</span>
              <div>
                <span className="font-semibold text-slate-900">{item.factor}</span>
                {item.description && (
                  <span className="text-slate-600"> — {item.description}</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Required Note */}
      <div className="pt-2 border-t border-slate-200">
        <p className="text-xs text-slate-500 italic">
          These observations are derived from the patient's entered clinical values and are not the model's direct explanation.
        </p>
      </div>
    </div>
  );
}
