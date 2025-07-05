import React, { useState, useCallback, useMemo, useEffect } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import { MapPin } from 'lucide-react';
import { Center } from '../types/center';
import { CenterCard } from './CenterCard';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapComponentProps {
  centers: Center[];
  filteredCenters: Center[];
}

export const MapComponent: React.FC<MapComponentProps> = ({ centers, filteredCenters }) => {
  const [selectedCenter, setSelectedCenter] = useState<Center | null>(null);
  const [viewState, setViewState] = useState({
    longitude: -79.3832,
    latitude: 43.6532,
    zoom: 10.5
  });

  // Filter centers that have valid coordinates
  const centersWithCoords = useMemo(() => {
    return filteredCenters.filter(center => 
      center.location.latitude !== null && 
      center.location.longitude !== null
    );
  }, [filteredCenters]);

  // Handle marker click - toggle selection
  const handleMarkerClick = useCallback((center: Center) => {
    if (selectedCenter?.center_id === center.center_id) {
      // If clicking the already selected marker, deselect it
      setSelectedCenter(null);
    } else {
      // Select the new marker
      setSelectedCenter(center);
      
      // Optionally fly to marker if it's near the edge of viewport
      const { longitude, latitude } = center.location;
      if (longitude && latitude) {
        // Simple check if marker is near viewport edges (within 20% of bounds)
        const bounds = {
          north: viewState.latitude + (0.5 / Math.pow(2, viewState.zoom - 8)),
          south: viewState.latitude - (0.5 / Math.pow(2, viewState.zoom - 8)),
          east: viewState.longitude + (0.5 / Math.pow(2, viewState.zoom - 8)),
          west: viewState.longitude - (0.5 / Math.pow(2, viewState.zoom - 8))
        };
        
        const margin = 0.2; // 20% margin
        const latRange = bounds.north - bounds.south;
        const lngRange = bounds.east - bounds.west;
        
        const isNearEdge = 
          latitude > bounds.north - (latRange * margin) ||
          latitude < bounds.south + (latRange * margin) ||
          longitude > bounds.east - (lngRange * margin) ||
          longitude < bounds.west + (lngRange * margin);
        
        if (isNearEdge) {
          setViewState(prev => ({
            ...prev,
            longitude,
            latitude,
            zoom: Math.max(prev.zoom, 12) // Ensure minimum zoom level
          }));
        }
      }
    }
  }, [selectedCenter, viewState]);

  // Handle map background click - dismiss card
  const handleMapClick = useCallback(() => {
    setSelectedCenter(null);
  }, []);

  // Handle keyboard events - ESC to dismiss
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && selectedCenter) {
        setSelectedCenter(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedCenter]);

  // Determine if a center is filtered out (for visual distinction)
  const isCenterFiltered = useCallback((center: Center) => {
    return !filteredCenters.some(fc => fc.center_id === center.center_id);
  }, [filteredCenters]);

  return (
    <div className="relative h-full w-full">
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        onClick={handleMapClick}
        mapStyle="mapbox://styles/mapbox/light-v11"
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        style={{ width: '100%', height: '100%' }}
        attributionControl={true}
        logoPosition="bottom-right"
      >
        {/* Render all centers with coordinates */}
        {centers
          .filter(center => 
            center.location.latitude !== null && 
            center.location.longitude !== null
          )
          .map(center => {
            const isFiltered = isCenterFiltered(center);
            const isSelected = selectedCenter?.center_id === center.center_id;
            
            return (
              <Marker
                key={center.center_id}
                longitude={center.location.longitude!}
                latitude={center.location.latitude!}
                anchor="bottom"
                onClick={(e) => {
                  e.originalEvent.stopPropagation();
                  if (!isFiltered) {
                    handleMarkerClick(center);
                  }
                }}
              >
                <div 
                  className={`relative cursor-pointer transition-all duration-300 transform ${
                    isFiltered 
                      ? 'opacity-30 scale-75' 
                      : isSelected
                      ? 'scale-125 z-10'
                      : 'hover:scale-110'
                  }`}
                >
                  {/* Pin Shadow */}
                  <div className={`absolute top-1 left-1 bg-black/20 rounded-full blur-sm transition-all duration-300 ${
                    isSelected ? 'w-10 h-10' : 'w-8 h-8'
                  }`}></div>
                  
                  {/* Main Pin - Unified design */}
                  <div className={`relative rounded-full border-3 border-white shadow-lg flex items-center justify-center transition-all duration-300 ${
                    isSelected
                      ? 'w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 ring-4 ring-indigo-200 ring-opacity-75'
                      : 'w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600'
                  }`}>
                    <MapPin className={`text-white transition-all duration-300 ${
                      isSelected ? 'h-5 w-5' : 'h-4 w-4'
                    }`} />
                  </div>
                  
                  {/* Pulse animation for selected marker */}
                  {isSelected && (
                    <div className="absolute inset-0 w-10 h-10 bg-indigo-400 rounded-full animate-ping opacity-75"></div>
                  )}
                  
                  {/* Subtle glow for selected marker */}
                  {isSelected && (
                    <div className="absolute inset-0 w-10 h-10 bg-indigo-400 rounded-full opacity-30 blur-md"></div>
                  )}
                </div>
              </Marker>
            );
          })}

        {/* Selected Center Popup */}
        {selectedCenter && selectedCenter.location.latitude && selectedCenter.location.longitude && (
          <Popup
            longitude={selectedCenter.location.longitude}
            latitude={selectedCenter.location.latitude}
            anchor="bottom"
            offset={[0, -50]}
            closeButton={false}
            closeOnClick={false}
            className="map-popup"
            maxWidth="400px"
          >
            <div className="p-0 bg-transparent">
              <div className="transform scale-95 origin-bottom">
                <CenterCard center={selectedCenter} />
              </div>
            </div>
          </Popup>
        )}
      </Map>

      {/* Stats Overlay - Bottom left */}
      <div className="absolute bottom-4 left-4 z-10">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-4">
          <div className="text-center">
            <div className="text-lg font-bold text-slate-800">
              {centersWithCoords.length}
            </div>
            <div className="text-xs text-slate-600 font-medium">
              Centers on Map
            </div>
            {selectedCenter && (
              <div className="text-xs text-indigo-600 font-medium mt-1">
                1 Selected
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Instructions overlay - Top right */}
      <div className="absolute top-4 right-4 z-10">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-3">
          <div className="space-y-1 text-xs text-slate-600">
            <div className="font-medium">Click a marker to view details</div>
            {selectedCenter && (
              <div className="text-indigo-600">Press ESC to close</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};