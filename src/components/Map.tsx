import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import Map, { Marker } from 'react-map-gl';
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
  const [cardPosition, setCardPosition] = useState<{ x: number; y: number } | null>(null);
  const [hasClickedMarker, setHasClickedMarker] = useState(false);
  const [viewState, setViewState] = useState({
    longitude: -79.3832,
    latitude: 43.6532,
    zoom: 10.5
  });
  
  const mapRef = useRef<any>(null);

  // Only show filtered centers that have valid coordinates
  const centersWithCoords = useMemo(() => {
    return filteredCenters.filter(center => 
      center.location.latitude !== null && 
      center.location.longitude !== null &&
      center.location.latitude !== undefined &&
      center.location.longitude !== undefined &&
      !isNaN(center.location.latitude) &&
      !isNaN(center.location.longitude)
    );
  }, [filteredCenters]);

  // Calculate optimal card position based on marker screen coordinates
  const calculateCardPosition = useCallback((center: Center) => {
    if (!mapRef.current || !center.location.latitude || !center.location.longitude) {
      return null;
    }

    try {
      const map = mapRef.current.getMap();
      if (!map) return null;

      // Get marker's screen coordinates
      const markerScreenCoords = map.project([center.location.longitude, center.location.latitude]);
      const mapContainer = map.getContainer();
      const containerRect = mapContainer.getBoundingClientRect();
      
      const markerX = markerScreenCoords.x;
      const markerY = markerScreenCoords.y;
      
      // Card dimensions (approximate)
      const cardWidth = 400;
      const cardHeight = 300;
      const margin = 20;
      
      let x = markerX;
      let y = markerY;
      
      // Check if card would overflow on the right
      if (markerX + cardWidth + margin > containerRect.width) {
        // Position to the left of marker
        x = markerX - cardWidth - margin;
      } else {
        // Position to the right of marker
        x = markerX + margin;
      }
      
      // Check vertical positioning
      if (markerY - cardHeight - margin < 0) {
        // Not enough space above, position below
        y = markerY + 40; // Account for marker height
      } else {
        // Position above marker
        y = markerY - cardHeight - margin;
      }
      
      // Ensure card stays within viewport bounds
      x = Math.max(margin, Math.min(x, containerRect.width - cardWidth - margin));
      y = Math.max(margin, Math.min(y, containerRect.height - cardHeight - margin));
      
      return { x, y };
    } catch (error) {
      console.warn('Error calculating card position:', error);
      return null;
    }
  }, []);

  // Handle marker click - toggle selection and calculate position
  const handleMarkerClick = useCallback((center: Center, event: any) => {
    event.originalEvent.stopPropagation();
    
    // Mark that user has clicked a marker (for onboarding)
    if (!hasClickedMarker) {
      setHasClickedMarker(true);
    }
    
    if (selectedCenter?.center_id === center.center_id) {
      // If clicking the already selected marker, deselect it
      setSelectedCenter(null);
      setCardPosition(null);
    } else {
      // Select the new marker
      setSelectedCenter(center);
      
      // Calculate card position after a brief delay to ensure map is ready
      setTimeout(() => {
        const position = calculateCardPosition(center);
        setCardPosition(position);
      }, 100);
    }
  }, [selectedCenter, calculateCardPosition, hasClickedMarker]);

  // Handle map background click - dismiss card
  const handleMapClick = useCallback(() => {
    setSelectedCenter(null);
    setCardPosition(null);
  }, []);

  // Handle keyboard events - ESC to dismiss
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && selectedCenter) {
        setSelectedCenter(null);
        setCardPosition(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedCenter]);

  // Recalculate card position when map moves
  useEffect(() => {
    if (selectedCenter && mapRef.current) {
      const position = calculateCardPosition(selectedCenter);
      setCardPosition(position);
    }
  }, [viewState, selectedCenter, calculateCardPosition]);

  return (
    <div className="relative h-full w-full">
      <Map
        ref={mapRef}
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        onClick={handleMapClick}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        style={{ width: '100%', height: '100%' }}
        attributionControl={true}
        logoPosition="bottom-right"
      >
        {/* Only render filtered centers with coordinates */}
        {centersWithCoords.map(center => {
          const isSelected = selectedCenter?.center_id === center.center_id;
          
          return (
            <Marker
              key={center.center_id}
              longitude={center.location.longitude!}
              latitude={center.location.latitude!}
              anchor="bottom"
              onClick={(e) => handleMarkerClick(center, e)}
            >
              <div 
                className={`relative cursor-pointer transition-all duration-300 transform ${
                  isSelected
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
      </Map>

      {/* Floating Card Overlay - Positioned based on marker location */}
      {selectedCenter && cardPosition && (
        <div 
          className="absolute z-50 pointer-events-none"
          style={{
            left: `${cardPosition.x}px`,
            top: `${cardPosition.y}px`,
            maxWidth: '400px',
            width: 'auto'
          }}
        >
          <div className="pointer-events-auto transform transition-all duration-300 ease-out">
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
              <CenterCard center={selectedCenter} />
            </div>
          </div>
        </div>
      )}

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

      {/* Instructions overlay - Top right (only show when no marker has ever been clicked) */}
      {!hasClickedMarker && (
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 backdrop-blur-xl rounded-2xl shadow-lg border border-indigo-200/60 p-4 animate-pulse">
            <div className="text-sm text-indigo-700 font-medium flex items-center space-x-2">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
              <span>Click a marker to view details</span>
            </div>
          </div>
        </div>
      )}

      {/* Selected center info overlay - Top right (only show when center is selected) */}
      {selectedCenter && (
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-3">
            <div className="text-xs text-slate-600 font-medium">
              Press ESC or click map to close
              Click a marker to view details
            </div>
          </div>
        </div>
      )}
    </div>
  );
};