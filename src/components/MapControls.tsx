import React from 'react';
import { RotateCcw, Plus, Minus } from 'lucide-react';

interface MapControlsProps {
  onRecenter: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  showRecenter: boolean;
  canZoomIn: boolean;
  canZoomOut: boolean;
}

export const MapControls: React.FC<MapControlsProps> = ({
  onRecenter,
  onZoomIn,
  onZoomOut,
  showRecenter,
  canZoomIn,
  canZoomOut
}) => {
  return (
    <div className="absolute bottom-4 right-4 z-20 flex flex-col space-y-2">
      {/* Recenter Button - Only show when needed */}
      {showRecenter && (
        <button
          onClick={onRecenter}
          className="bg-white/95 backdrop-blur-xl hover:bg-white text-slate-700 hover:text-indigo-600 p-3 rounded-xl shadow-lg border border-white/30 transition-all duration-200 hover:shadow-xl group"
          title="Reset map view to show all results"
        >
          <RotateCcw className="h-5 w-5 group-hover:rotate-180 transition-transform duration-300" />
        </button>
      )}
      
      {/* Zoom Controls */}
      <div className="flex flex-col space-y-1 bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-white/30 p-1">
        {/* Zoom In */}
        <button
          onClick={onZoomIn}
          disabled={!canZoomIn}
          className={`p-2.5 rounded-lg transition-all duration-200 ${
            canZoomIn
              ? 'text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 hover:shadow-sm'
              : 'text-slate-300 cursor-not-allowed'
          }`}
          title="Zoom in"
        >
          <Plus className="h-4 w-4" />
        </button>
        
        {/* Divider */}
        <div className="h-px bg-slate-200 mx-1"></div>
        
        {/* Zoom Out */}
        <button
          onClick={onZoomOut}
          disabled={!canZoomOut}
          className={`p-2.5 rounded-lg transition-all duration-200 ${
            canZoomOut
              ? 'text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 hover:shadow-sm'
              : 'text-slate-300 cursor-not-allowed'
          }`}
          title="Zoom out"
        >
          <Minus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};