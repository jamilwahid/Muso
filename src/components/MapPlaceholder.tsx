import React, { useState } from 'react';
import { MapPin, Zap, Map, AlertCircle } from 'lucide-react';
import { MapComponent } from './Map';
import { Center } from '../types/center';

interface MapPlaceholderProps {
  centers: Center[];
  filteredCount: number;
  filteredCenters: Center[];
}

export const MapPlaceholder: React.FC<MapPlaceholderProps> = ({ 
  centers, 
  filteredCount, 
  filteredCenters 
}) => {
  const [mapError, setMapError] = useState(false);
  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;

  // Check if we have a Mapbox token
  if (!mapboxToken) {
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
              <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 p-4 rounded-2xl">
                <AlertCircle className="h-12 w-12 text-white" />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-slate-800">Map Configuration Needed</h3>
            <p className="text-slate-600 max-w-md leading-relaxed">
              To display the interactive map, please add your Mapbox access token to the environment variables.
            </p>
            
            <div className="bg-white/80 backdrop-blur-xl p-4 rounded-2xl shadow-lg border border-white/20 max-w-lg">
              <div className="text-left space-y-2">
                <p className="text-sm font-semibold text-slate-700">Add to your .env file:</p>
                <code className="block bg-slate-100 p-2 rounded-lg text-xs font-mono text-slate-800">
                  VITE_MAPBOX_TOKEN=your_mapbox_token_here
                </code>
                <p className="text-xs text-slate-500">
                  Get your free token at <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">mapbox.com</a>
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
      <div className="h-full bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 flex items-center justify-center relative overflow-hidden">
        <div className="text-center space-y-6 relative z-10">
          <div className="relative">
            <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/20 inline-block">
              <div className="bg-gradient-to-br from-red-500 via-pink-500 to-purple-500 p-4 rounded-2xl">
                <AlertCircle className="h-12 w-12 text-white" />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-slate-800">Map Loading Error</h3>
            <p className="text-slate-600 max-w-md leading-relaxed">
              There was an issue loading the map. Please check your internet connection and Mapbox token.
            </p>
            
            <button
              onClick={() => setMapError(false)}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-2xl font-bold hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
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
      <div className="h-full w-full">
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