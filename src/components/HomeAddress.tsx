import React, { useState, useRef, useEffect } from 'react';
import { Search, Home, MapPin, X, Loader2, Edit3 } from 'lucide-react';

interface HomeAddressProps {
  onLocationSelect: (longitude: number, latitude: number, zoom?: number) => void;
}

interface HomeLocation {
  name: string;
  address: string;
  lat: number;
  lng: number;
}

export const HomeAddress: React.FC<HomeAddressProps> = ({ onLocationSelect }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [homeLocation, setHomeLocation] = useState<HomeLocation | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  // Load saved home location from localStorage
  useEffect(() => {
    const savedHome = localStorage.getItem('muso-home-location');
    if (savedHome) {
      try {
        setHomeLocation(JSON.parse(savedHome));
      } catch (e) {
        console.warn('Failed to load home location');
      }
    }
  }, []);

  // Handle clicks outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsModalOpen(false);
        setShowMobileMenu(false);
      }
    };

    if (isModalOpen || showMobileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isModalOpen, showMobileMenu]);

  // Focus search input when modal opened
  useEffect(() => {
    if (isModalOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isModalOpen]);

  // Debounced search
  useEffect(() => {
    if (searchQuery.length < 3) {
      setSearchResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      await performSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const performSearch = async (query: string) => {
    setIsSearching(true);
    try {
      // GTA bounding box coordinates (southwest and northeast corners)
      // Southwest: Mississauga/Oakville area, Northeast: Markham/Pickering area
      const gtaBbox = '-79.8,43.4,-79.0,43.9';
      
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${import.meta.env.VITE_MAPBOX_TOKEN}&country=CA&proximity=-79.3832,43.6532&bbox=${gtaBbox}&types=address,poi&limit=5`
      );
      
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.features || []);
      }
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSetHome = (feature: any) => {
    const location: HomeLocation = {
      name: feature.text,
      address: formatAddress(feature),
      lat: feature.center[1],
      lng: feature.center[0]
    };
    
    setHomeLocation(location);
    localStorage.setItem('muso-home-location', JSON.stringify(location));
    
    // Trigger a custom event to notify the map component
    window.dispatchEvent(new CustomEvent('homeLocationSet', { detail: location }));
    
    // Navigate to home with appropriate zoom
    onLocationSelect(location.lng, location.lat, 12);
    
    setIsModalOpen(false);
    setShowMobileMenu(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleGoHome = () => {
    if (homeLocation) {
      onLocationSelect(homeLocation.lng, homeLocation.lat, 12);
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(true);
    setShowMobileMenu(false);
  };

  const handleMainButtonClick = () => {
    if (homeLocation) {
      handleGoHome();
    } else {
      setIsModalOpen(true);
    }
  };

  // Mobile long press handlers
  const handleTouchStart = () => {
    if (homeLocation) {
      longPressTimer.current = setTimeout(() => {
        setShowMobileMenu(true);
      }, 500); // 500ms long press
    }
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const formatAddress = (feature: any) => {
    return feature.place_name.split(',').slice(0, 2).join(',');
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Main Home Button */}
      <div className="relative">
        <button
          onClick={handleMainButtonClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className={`group relative flex items-center space-x-2 px-4 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl border-2 ${
            homeLocation
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-white/20 hover:from-emerald-600 hover:to-teal-700'
              : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-white/20 hover:from-indigo-600 hover:to-purple-700'
          }`}
          title={homeLocation ? 'Click to recenter. Hover to edit address.' : 'Set your home address'}
        >
          <Home className="h-5 w-5" />
          <span className="hidden sm:inline">
            {homeLocation ? 'Home' : 'Set Home Address'}
          </span>
          
          {/* Hover Edit Icon - Desktop only */}
          {homeLocation && isHovered && (
            <div 
              className="absolute -top-1 -right-1 bg-white text-slate-700 p-1.5 rounded-full shadow-lg border border-slate-200 cursor-pointer hover:bg-slate-50 transition-all duration-200 animate-in fade-in zoom-in-95"
              onClick={handleEditClick}
              title="Edit home address"
            >
              <Edit3 className="h-3 w-3" />
            </div>
          )}
        </button>

        {/* Mobile Menu - Shows on long press */}
        {showMobileMenu && homeLocation && (
          <div className="absolute top-full left-0 mt-2 bg-white/95 backdrop-blur-xl rounded-xl shadow-xl border border-white/30 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <button
              onClick={handleEditClick}
              className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 transition-colors duration-200 w-full text-left"
            >
              <Edit3 className="h-4 w-4 text-slate-600" />
              <span className="text-sm font-medium text-slate-700">Edit Home Address</span>
            </button>
          </div>
        )}
      </div>

      {/* Set/Edit Home Address Modal */}
      {isModalOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 z-[200] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300 max-h-[calc(100vh-8rem)] flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-slate-100 flex-shrink-0">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 flex items-center space-x-2">
                <Home className="h-5 w-5 text-emerald-600" />
                <span>{homeLocation ? 'Edit Home Address' : 'Set Home Address'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 transition-colors duration-200"
              >
                <X className="h-4 w-4 text-slate-500" />
              </button>
            </div>
          </div>

          {/* Current Home */}
          {homeLocation && (
            <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-emerald-500 p-2 rounded-xl">
                    <Home className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-emerald-800">{homeLocation.name}</div>
                    <div className="text-sm text-emerald-600">{homeLocation.address}</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    handleGoHome();
                    setIsModalOpen(false);
                  }}
                  className="bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors duration-200"
                >
                  Go
                </button>
              </div>
            </div>
          )}

          {/* Search */}
          <div className="p-4 flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder={homeLocation ? "Search for a new address..." : "Enter your home address..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              {isSearching && (
                <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-emerald-500 animate-spin" />
              )}
            </div>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="flex-1 overflow-y-auto min-h-0">
              {searchResults.map((feature, index) => (
                <div key={index} className="px-4 py-2">
                  <button
                    onClick={() => handleSetHome(feature)}
                    className="w-full flex items-center space-x-3 p-3 hover:bg-slate-50 rounded-xl transition-colors duration-200 text-left group"
                  >
                    <MapPin className="h-4 w-4 text-slate-400 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-slate-800 truncate">{feature.text}</div>
                      <div className="text-sm text-slate-500 leading-relaxed">{feature.place_name}</div>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {searchQuery.length >= 3 && searchResults.length === 0 && !isSearching && (
            <div className="p-8 text-center flex-1 flex flex-col justify-center">
              <div className="text-slate-400 mb-2">
                <Search className="h-8 w-8 mx-auto" />
              </div>
              <div className="text-sm text-slate-500">No results found</div>
              <div className="text-xs text-slate-400 mt-1">Try a different address or postal code</div>
            </div>
          )}

          {/* Helper Text */}
          <div className="p-3 bg-gradient-to-r from-emerald-50 to-teal-50 border-t border-emerald-100 flex-shrink-0">
            <div className="flex items-center space-x-2 text-xs text-emerald-700">
              <Home className="h-3.5 w-3.5 flex-shrink-0" />
              <span>💡 {homeLocation ? 'Update your home to recenter the map to a new area' : 'Set your home to quickly focus the map on your neighborhood'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};