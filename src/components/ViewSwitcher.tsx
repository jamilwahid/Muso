import React from 'react';
import { MapPin } from 'lucide-react';

interface ViewSwitcherProps {
  currentView: 'map' | 'list';
  onViewChange: (view: 'map' | 'list') => void;
}

export const ViewSwitcher: React.FC<ViewSwitcherProps> = ({ 
  currentView, 
  onViewChange 
}) => {
  return (
    <div className="absolute top-4 right-4 z-20" style={{ right: '1rem' }}>
      <div className="flex items-center bg-white/90 backdrop-blur-xl rounded-xl p-1 shadow-lg border border-white/30">
        <button
          onClick={() => onViewChange('map')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            currentView === 'map'
              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <MapPin className="h-4 w-4" />
          <span>Map</span>
        </button>
        <button
          onClick={() => onViewChange('list')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            currentView === 'list'
              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          <span>List</span>
        </button>
      </div>
    </div>
  );
};