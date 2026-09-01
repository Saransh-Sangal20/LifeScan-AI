import React from 'react';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Brand Info */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center text-white">
              <Heart className="w-4 h-4 fill-white" />
            </div>
            <div>
              <span className="font-bold text-slate-800">LifeScan AI</span>
              <span className="text-slate-400 mx-2">|</span>
              <span className="text-xs text-slate-500">Heart Failure Detection System</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6 text-xs font-medium text-slate-600">
            <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <Link to="/dashboard" className="hover:text-blue-600 transition-colors">Dashboard</Link>
            <Link to="/add-patient" className="hover:text-blue-600 transition-colors">Add Patient</Link>
            <Link to="/history" className="hover:text-blue-600 transition-colors">Patient History</Link>
          </div>

          {/* Copyright */}
          <div className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} LifeScan AI. All rights reserved.
          </div>

        </div>
      </div>
    </footer>
  );
}
