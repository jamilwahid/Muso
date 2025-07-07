import React from 'react';
import { Plus, Minus } from 'lucide-react';

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  canZoomIn: boolean;
  canZoomOut: boolean;
}

export const MapControls: React.FC<MapControlsProps> = ({
  onZoomIn,
  onZoomOut,
  canZoomIn,
  canZoomOut
}) => {
  return (
    <div className="absolute bottom-4 right-4 z-[100] flex flex-col space-y-2">
      {/* Zoom Controls */}
      <div className="flex flex-col space-y-1 bg-white/95 backdrop-blur-xl rounded-lg shadow-lg border border-white/30 p-1">
        {/* Zoom In */}
        <button
          onClick={onZoomIn}
          disabled={!canZoomIn}
          className={`p-2 rounded-md transition-all duration-200 relative ${
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
          className={`p-2 rounded-md transition-all duration-200 relative ${
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