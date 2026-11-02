import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { MapComponent } from './Map';
import { Center } from '../types/center';

interface MapPlaceholderProps {
  centers: Center[];
  filteredCount: number;
  filteredCenters: Center[];
}

export const MapPlaceholder: React.FC<MapPlaceholderProps> = ({ 
  centers, 
  filteredCenters 
}) => {
  const [mapError, setMapError] = useState(false);
  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;

  // Debug: Log the token status (remove this after testing)
  console.log('Mapbox token exists:', !!mapboxToken);
  console.log('Token length:', mapboxToken?.length || 0);

  // Check if we have a Mapbox token
  if (!mapboxToken || mapboxToken.trim() === '') {
    return (
      <div className="flex h-full items-center justify-center overflow-auto bg-[#f2f6ef] p-5">
        
        <div className="w-full max-w-lg space-y-6 rounded-3xl border border-[#dce8de] bg-[#fafbf7] p-6 text-center shadow-lg sm:p-8">
          <div className="relative">
            <div className="inline-flex rounded-2xl bg-[#e4f0e6] p-4">
              <AlertCircle className="h-8 w-8 text-[#175d3e]" />
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-[#17392a]">Map Configuration Needed</h3>
            <p className="max-w-md leading-relaxed text-[#53685a]">
              To display the interactive map, please add your Mapbox access token to the environment variables.
            </p>
            
            <div className="max-w-lg rounded-2xl border border-[#dce8de] bg-white p-4">
              <div className="text-left space-y-2">
                <p className="text-sm font-semibold text-[#284a36]">Add to your .env file:</p>
                <code className="block break-all rounded-lg bg-[#f2f6ef] p-2 font-mono text-xs text-[#203c2c]">
                  VITE_MAPBOX_TOKEN=your_mapbox_token_here
                </code>
                <p className="text-sm text-[#53685a]">
                  Get your free token at <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-[#175d3e] underline">mapbox.com</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If there's a map error, show fallback
  if (mapError) {
    return (
      <div className="flex h-full items-center justify-center overflow-auto bg-[#f2f6ef] p-5">
        <div className="w-full max-w-lg space-y-6 rounded-3xl border border-[#dce8de] bg-[#fafbf7] p-6 text-center shadow-lg sm:p-8">
          <div className="relative">
            <div className="inline-flex rounded-2xl bg-[#e4f0e6] p-4">
              <AlertCircle className="h-8 w-8 text-[#175d3e]" />
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-[#17392a]">Map Loading Error</h3>
            <p className="max-w-md leading-relaxed text-[#53685a]">
              There was an issue loading the map. Please check your internet connection and Mapbox token.
            </p>
            
            <button
              onClick={() => setMapError(false)}
              className="min-h-11 rounded-full bg-[#175d3e] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#124b33] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#175d3e]"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render the actual map
  try {
    return (
      <div className="h-full w-full" data-onboarding="map-area">
        <MapComponent 
          centers={centers}
          filteredCenters={filteredCenters}
        />
      </div>
    );
  } catch (error) {
    console.error('Map rendering error:', error);
    setMapError(true);
    return null;
  }
};
