import React, { useState, useCallback, useMemo } from 'react';
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

  const handleMarkerClick = useCallback((center: Center) => {
    setSelectedCenter(center);
  }, []);

  const handleMapClick = useCallback(() => {
    setSelectedCenter(null);
  }, []);

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
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoibXVzby1hcHAiLCJhIjoiY20zZzFqZGNzMDFhZzJrcHpxbGNxZGNwZCJ9.example'}
        style={{ width: '100%', height: '100%' }}
        attributionControl={false}
        logoPosition="bottom-right"
        interactiveLayerIds={[]}
      >
        {/* Render all centers with coordinates */}
        {centers
          .filter(center => 
            center.location.latitude !== null && 
            center.location.longitude !== null
          )
          .map(center => {
            const isFiltered = isCenterFiltered(center);
            
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
                  className={`relative cursor-pointer transition-all duration-300 transform hover:scale-110 ${
                    isFiltered ? 'opacity-30' : 'opacity-100'
                  }`}
                >
                  {/* Pin Shadow */}
                  <div className="absolute top-1 left-1 w-8 h-8 bg-black/20 rounded-full blur-sm"></div>
                  
                  {/* Main Pin */}
                  <div className={`relative w-8 h-8 rounded-full border-3 border-white shadow-lg flex items-center justify-center ${
                    selectedCenter?.center_id === center.center_id
                      ? 'bg-gradient-to-br from-amber-400 to-orange-500 ring-4 ring-amber-200'
                      : center.CWELCC_participant
                      ? 'bg-gradient-to-br from-purple-500 to-indigo-600'
                      : 'bg-gradient-to-br from-emerald-500 to-teal-600'
                  }`}>
                    <MapPin className="h-4 w-4 text-white" />
                  </div>
                  
                  {/* Pulse animation for selected */}
                  {selectedCenter?.center_id === center.center_id && (
                    <div className="absolute inset-0 w-8 h-8 bg-amber-400 rounded-full animate-ping opacity-75"></div>
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
            offset={[0, -40]}
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

      {/* Map Controls Overlay */}
      <div className="absolute top-4 right-4 z-10">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-3">
          <div className="space-y-2 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full border border-white"></div>
              <span className="text-slate-600 font-medium">CWELCC Centers</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full border border-white"></div>
              <span className="text-slate-600 font-medium">Other Centers</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full border border-white"></div>
              <span className="text-slate-600 font-medium">Selected</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overlay */}
      <div className="absolute bottom-4 left-4 z-10">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-4">
          <div className="text-center">
            <div className="text-lg font-bold text-slate-800">
              {centersWithCoords.length}
            </div>
            <div className="text-xs text-slate-600 font-medium">
              Centers on Map
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};