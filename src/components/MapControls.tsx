import React from 'react';
import { Plus, Minus } from 'lucide-react';

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  canZoomIn: boolean;
  canZoomOut: boolean;
  selected: boolean;
  expanded: boolean;
}

export const MapControls: React.FC<MapControlsProps> = ({
  onZoomIn,
  onZoomOut,
  canZoomIn,
  canZoomOut,
  selected,
  expanded
}) => {
  return (
    <div className={`absolute right-4 z-20 flex flex-col space-y-2 md:bottom-4 ${selected ? (expanded ? 'hidden md:flex' : 'bottom-[calc(60%+3rem)]') : 'bottom-14'}`}>
      {/* Zoom Controls */}
      <div className="flex flex-col rounded-2xl border border-[#dce8de] bg-[#fafbf7]/95 p-1 shadow-lg backdrop-blur-xl">
        {/* Zoom In */}
        <button
          onClick={onZoomIn}
          disabled={!canZoomIn}
          className={`flex h-11 w-11 items-center justify-center rounded-xl transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#175d3e] ${
            canZoomIn
              ? 'text-[#175d3e] hover:bg-[#edf5ed]'
              : 'text-[#a8bbae] cursor-not-allowed'
          }`}
          title="Zoom in"
          aria-label="Zoom in"
        >
          <Plus className="h-4 w-4" />
        </button>
        
        {/* Divider */}
        <div className="mx-1 h-px bg-[#dce8de]"></div>
        
        {/* Zoom Out */}
        <button
          onClick={onZoomOut}
          disabled={!canZoomOut}
          className={`flex h-11 w-11 items-center justify-center rounded-xl transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#175d3e] ${
            canZoomOut
              ? 'text-[#175d3e] hover:bg-[#edf5ed]'
              : 'text-[#a8bbae] cursor-not-allowed'
          }`}
          title="Zoom out"
          aria-label="Zoom out"
        >
          <Minus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
