import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingPulse({ message = "Processing patient clinical data..." }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3 text-center">
      <Loader2 className="w-8 h-8 text-[#2563EB] animate-spin" />
      <p className="text-xs font-medium text-slate-600">
        {message}
      </p>
    </div>
  );
}
