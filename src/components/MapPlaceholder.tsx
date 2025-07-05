import React from 'react';
import { MapPin, Zap, Map } from 'lucide-react';

interface MapPlaceholderProps {
  filteredCount: number;
}

export const MapPlaceholder: React.FC<MapPlaceholderProps> = ({ filteredCount }) => {
  return (
    <div className="h-full bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 flex items-center justify-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, #6366f1 2px, transparent 0), radial-gradient(circle at 75px 75px, #8b5cf6 2px, transparent 0)`,
          backgroundSize: '100px 100px'
        }}></div>
      </div>
      
      <div className="text-center space-y-6 relative z-10">
        <div className="relative">
          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/20 inline-block">
            <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4 rounded-2xl">
              <Map className="h-12 w-12 text-white" />
            </div>
          </div>
          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-emerald-400 to-teal-500 text-white text-sm font-bold rounded-full h-8 w-8 flex items-center justify-center shadow-lg">
            <Zap className="h-4 w-4" />
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-slate-800">Interactive Map Coming Soon</h3>
          <p className="text-slate-600 max-w-md leading-relaxed">
            We're integrating advanced mapping to show you exactly where each childcare center is located with real-time availability.
          </p>
          
          <div className="inline-flex items-center space-x-3 bg-white/80 backdrop-blur-xl px-6 py-3 rounded-2xl shadow-lg border border-white/20">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-slate-700">Currently showing</span>
            </div>
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 py-1 rounded-xl text-sm font-bold">
              {filteredCount} centers
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};