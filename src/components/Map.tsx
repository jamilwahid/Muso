import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import MapGL, { Marker } from 'react-map-gl';
import { MapPin } from 'lucide-react';
import { Center } from '../types/center';
import { CenterDetailsPanel } from './CenterDetailsPanel';
import { MapControls } from './MapControls';
import { useFavorites } from '../hooks/useFavorites';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapComponentProps {
  centers: Center[];
  filteredCenters: Center[];
}

export const MapComponent: React.FC<MapComponentProps> = ({ filteredCenters }) => {
  const [selectedCenter, setSelectedCenter] = useState<Center | null>(null);
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const [mobile, setMobile] = useState(() => window.matchMedia('(max-width: 767px)').matches);
  useEffect(() => {
    const query = window.matchMedia('(max-width: 767px)');
    const update = () => setMobile(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  const [hoveredCenter, setHoveredCenter] = useState<Center | null>(null);
  const favoritesHook = useFavorites();
  const { favorites, favoritesCount } = favoritesHook;
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);
  const [, setCardPosition] = useState<{ x: number; y: number } | null>(null);
  const [showMapHint, setShowMapHint] = useState(false);
  const [showDismissHint, setShowDismissHint] = useState(false);
  const [viewState, setViewState] = useState({
    longitude: -79.3832,
    latitude: 43.6532,
    zoom: 10.5
  });
  
  const mapRef = useRef<any>(null);
  // Auto-dismiss map hint after 8 seconds
  useEffect(() => {
    if (showMapHint) {
      const timer = setTimeout(() => {
        setShowMapHint(false);
      }, 8000);
      
      return () => clearTimeout(timer);
    }
  }, [showMapHint]);

  // Only show filtered centers that have valid coordinates
  const centersWithCoords = useMemo(() => {
    console.log('🔄 Map re-rendering with favorites:', favorites);
    return filteredCenters.filter(center => 
      center.location.latitude !== null && 
      center.location.longitude !== null &&
      center.location.latitude !== undefined &&
      center.location.longitude !== undefined &&
      !isNaN(center.location.latitude) &&
      !isNaN(center.location.longitude)
    );
  }, [filteredCenters, favorites, favoritesCount]); // Force re-render when favorites change

  // Handle map movement to track user interaction
  const handleMove = useCallback((evt: any) => {
    setViewState(evt.viewState);
  }, []);

  // Zoom controls
  const handleZoomIn = useCallback(() => {
    setViewState(prev => ({
      ...prev,
      zoom: Math.min(prev.zoom + 1, 18)
    }));
  }, []);

  const handleZoomOut = useCallback(() => {
    setViewState(prev => ({
      ...prev,
      zoom: Math.max(prev.zoom - 1, 1)
    }));
  }, []);

  // Determine if zoom buttons should be enabled
  const canZoomIn = viewState.zoom < 18;
  const canZoomOut = viewState.zoom > 1;

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
    
    // Mark that user has clicked a marker and hide hints
    const hasClickedBefore = localStorage.getItem('muso-clicked-marker') === 'true';
    if (!hasClickedBefore) {
      localStorage.setItem('muso-clicked-marker', 'true');
      setShowMapHint(false);
      setShowDismissHint(true);
      
      // Auto-hide dismiss hint after 5 seconds
      setTimeout(() => {
        setShowDismissHint(false);
      }, 5000);
    }
    
    if (selectedCenter?.center_id === center.center_id) {
      // If clicking the already selected marker, deselect it
      setSelectedCenter(null);
      setCardPosition(null);
    } else {
      // Select the new marker
      setSelectedCenter(center);
      setSheetExpanded(false);
      if (mobile && mapRef.current) {
        mapRef.current.getMap().easeTo({ center: [center.location.longitude!, center.location.latitude!], offset: [0, -Math.round(mapRef.current.getMap().getContainer().clientHeight * 0.24)], duration: 450 });
      }
      
      // Calculate card position after a brief delay to ensure map is ready
      setTimeout(() => {
        const position = calculateCardPosition(center);
        setCardPosition(position);
      }, 100);
    }
  }, [selectedCenter, calculateCardPosition, mobile]);

  // Handle marker hover
  const handleMarkerMouseEnter = useCallback((center: Center, event: any) => {
    setHoveredCenter(center);
    
    // Calculate tooltip position based on mouse coordinates
    const rect = event.target.getBoundingClientRect();
    const mapContainer = mapRef.current?.getContainer();
    if (mapContainer) {
      const mapRect = mapContainer.getBoundingClientRect();
      setTooltipPosition({
        x: rect.left - mapRect.left + rect.width / 2,
        y: rect.top - mapRect.top - 10 // Position above the marker
      });
    }
  }, []);

  const handleMarkerMouseLeave = useCallback(() => {
    setHoveredCenter(null);
    setTooltipPosition(null);
  }, []);
  // Handle map background click - dismiss card
  const handleMapClick = useCallback(() => {
    setSelectedCenter(null);
    setCardPosition(null);
  }, []);

  // Close details if the selected centre no longer matches the active filter.
  useEffect(() => {
    if (selectedCenter && !filteredCenters.some(center => center.center_id === selectedCenter.center_id)) {
      setSelectedCenter(null);
      setCardPosition(null);
    }
  }, [filteredCenters, selectedCenter]);

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
    <div className={`muso-map relative h-full w-full ${selectedCenter ? (sheetExpanded ? 'sheet-expanded' : 'sheet-collapsed') : ''}`}>
      <MapGL
        ref={mapRef}
        {...viewState}
        onMove={handleMove}
        onClick={handleMapClick}
        mapStyle="mapbox://styles/mapbox/light-v11"
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        style={{ width: '100%', height: '100%' }}
        attributionControl={true}
        logoPosition="bottom-left"
      >
        {centersWithCoords.map((center) => {
          const isSelected = selectedCenter?.center_id === center.center_id;
          const isCenterFavorited = favoritesHook.isFavorite(center.center_id);
          
          // Debug logging for favorited centers
          if (isCenterFavorited) {
            console.log(`✨ FAVORITED Center on map: ${center.center_name} (${center.center_id})`);
          }
          
          return (
            <Marker
              key={`${center.center_id}-${isCenterFavorited ? 'fav' : 'normal'}-${favoritesCount}`}
              longitude={center.location.longitude!}
              latitude={center.location.latitude!}
              anchor="bottom"
              style={{ zIndex: isSelected ? 5 : 1 }}
              onClick={(e) => handleMarkerClick(center, e)}
            >
              <div 
                className={`relative cursor-pointer transition-all duration-300 transform ${
                  isSelected
                    ? 'scale-125 z-10'
                    : 'hover:scale-110'
                }`}
                onMouseEnter={(e) => handleMarkerMouseEnter(center, e)}
                onMouseLeave={handleMarkerMouseLeave}
              >
                {/* Main Pin - Debug the styling */}
                <div className={`relative rounded-full border-3 border-white shadow-lg flex items-center justify-center transition-all duration-300 ${
                  isSelected
                    ? 'w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 ring-4 ring-indigo-200'
                    : isCenterFavorited
                    ? 'w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 ring-4 ring-pink-300 ring-opacity-75'
                    : 'w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800'
                }`}>
                  <MapPin className={`text-white transition-all duration-300 ${
                    isSelected ? 'h-5 w-5' : 'h-4 w-4'
                  }`} />
                  
                  {/* Debug indicator for favorited markers */}
                  {isCenterFavorited && !isSelected && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-pink-400 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                  )}
                </div>
                
                {/* Subtle glow for selected marker */}
                {isSelected && (
                  <div className="absolute inset-0 w-10 h-10 bg-indigo-400 rounded-full opacity-30 blur-md"></div>
                )}
                
                {/* Enhanced glow for favorited marker */}
                {isCenterFavorited && !isSelected && (
                  <div className="absolute inset-0 w-12 h-12 bg-pink-400 rounded-full opacity-60 blur-lg animate-pulse -translate-x-2 -translate-y-2"></div>
                )}
              </div>
            </Marker>
          );
        })}

      </MapGL>

      {/* Hover Tooltip */}
      {hoveredCenter && tooltipPosition && !selectedCenter && (
        <div 
          className="absolute z-40 pointer-events-none"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            transform: 'translateX(-50%) translateY(-100%)'
          }}
        >
          <div className="bg-slate-800 text-white px-3 py-2 rounded-lg shadow-lg text-sm font-medium max-w-xs">
            <div className="truncate">
              {hoveredCenter.center_name}
            </div>
            {/* Tooltip arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2">
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800"></div>
            </div>
          </div>
        </div>
      )}
      {/* Centre details stay within reach on small screens. */}
      {selectedCenter && (
        <CenterDetailsPanel key={selectedCenter.center_id} center={selectedCenter} expanded={sheetExpanded} onExpandedChange={setSheetExpanded} onClose={() => { setSelectedCenter(null); setCardPosition(null); }} />
      )}

      {/* Map Navigation Controls */}
      <MapControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        canZoomIn={canZoomIn}
        canZoomOut={canZoomOut}
        selected={!!selectedCenter}
        expanded={sheetExpanded}
      />


      {/* Instructions overlay - Top right (only show when no center is selected) */}
      {!selectedCenter && showMapHint && (
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl shadow-xl border border-white/20 p-4">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-xl">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-bold">Ready to explore?</div>
                <div className="text-xs opacity-90">Click any marker to view center details</div>
              </div>
            </div>
            <button
              onClick={() => {
                setShowMapHint(false);
              }}
              className="absolute top-2 right-2 text-white/70 hover:text-white transition-colors duration-200"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Dismissal instructions - Show when center is selected and user hasn't seen this before */}
      {selectedCenter && showDismissHint && (
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-slate-800 text-white rounded-2xl shadow-xl border border-white/20 p-4">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-xl">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.122 2.122" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-bold">Great!</div>
                <div className="text-xs opacity-90">Click outside or press ESC to close</div>
              </div>
            </div>
            <button
              onClick={() => {
                setShowDismissHint(false);
              }}
              className="absolute top-2 right-2 text-white/70 hover:text-white transition-colors duration-200"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
