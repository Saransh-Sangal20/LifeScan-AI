import React from 'react';
import { Check } from 'lucide-react';

export default function RecommendationsCard({ recommendations = [] }) {
  // If backend provided structured recommendations, extract all items; otherwise provide default checklist
  let itemsList = [];

  if (Array.isArray(recommendations) && recommendations.length > 0) {
    recommendations.forEach(rec => {
      if (Array.isArray(rec.items)) {
        itemsList.push(...rec.items);
      } else if (rec.text) {
        itemsList.push(rec.text);
      }
    });
  }

  // Fallback / standard recommendations if itemsList is empty
  if (itemsList.length === 0) {
    itemsList = [
      'Reduce salt intake',
      'Maintain healthy diet',
      'Regular physical activity (as medically appropriate)',
      'Routine health monitoring',
      'Consult a cardiologist'
    ];
  }

  return (
    <div className="app-card p-6 space-y-4">
      <div>
        <h3 className="text-base font-bold text-slate-900">
          Clinical & Lifestyle Recommendations
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Recommended guidelines based on risk evaluation
        </p>
      </div>

      {/* Checklist */}
      <ul className="space-y-2.5">
        {itemsList.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
            <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
              <Check className="w-3 h-3 stroke-[3]" />
            </div>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
