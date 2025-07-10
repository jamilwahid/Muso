import React, { useState, useRef, useEffect } from 'react';
import { Search, Home, MapPin, Navigation, X, Clock, Star, Settings, Check, Loader2 } from 'lucide-react';

interface HomeBaseProps {
  onLocationSelect: (longitude: number, latitude: number, zoom?: number) => void;
}

// Popular Toronto neighborhoods as quick options
const QUICK_AREAS = [
  { name: 'Downtown Toronto', lat: 43.6532, lng: -79.3832, zoom: 13 },
  { name: 'North York', lat: 43.7615, lng: -79.4111, zoom: 12 },
  { name: 'Scarborough', lat: 43.7731, lng: -79.2578, zoom: 12 },
  { name: 'Etobicoke', lat: 43.6205, lng: -79.5132, zoom: 12 },
  { name: 'Mississauga', lat: 43.5890, lng: -79.6441, zoom: 12 },
  { name: 'Markham', lat: 43.8561, lng: -79.3370, zoom: 12 }
];

interface SavedLocation {
  name: string;
  address: string;
  lat: number;
  lng: number;
  zoom: number;
}

export const HomeBase: React.FC<HomeBaseProps> = ({ onLocationSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [homeLocation, setHomeLocation] = useState<SavedLocation | null>(null);
  const [showSetHome, setShowSetHome] = useState(false);
  const [recentSearches, setRecentSearches] = useState<SavedLocation[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load saved data from localStorage
  useEffect(() => {
    const savedHome = localStorage.getItem('muso-home-location');
    const savedRecent = localStorage.getItem('muso-recent-locations');
    
    if (savedHome) {
      try {
        setHomeLocation(JSON.parse(savedHome));
      } catch (e) {
        console.warn('Failed to load home location');
      }
    }
    
    if (savedRecent) {
      try {
        setRecentSearches(JSON.parse(savedRecent));
      } catch (e) {
        console.warn('Failed to load recent searches');
      }
    }
  }, []);

  // Handle clicks outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowSetHome(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

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
      // Using Mapbox Geocoding API
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${import.meta.env.VITE_MAPBOX_TOKEN}&country=CA&proximity=-79.3832,43.6532&types=address,poi&limit=5`
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

  const handleLocationSelect = (location: { name: string; address: string; lat: number; lng: number; zoom?: number }) => {
    const zoom = location.zoom || 15;
    onLocationSelect(location.lng, location.lat, zoom);
    
    // Add to recent searches (avoid duplicates)
    const newRecent = [
      location,
      ...recentSearches.filter(r => r.address !== location.address)
    ].slice(0, 5);
    
    setRecentSearches(newRecent);
    localStorage.setItem('muso-recent-locations', JSON.stringify(newRecent));
    
    setIsOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleSetAsHome = (location: SavedLocation) => {
    setHomeLocation(location);
    localStorage.setItem('muso-home-location', JSON.stringify(location));
    setShowSetHome(false);
    
    // Show success feedback
    const button = document.querySelector('[data-home-button]') as HTMLElement;
    if (button) {
      button.style.transform = 'scale(1.1)';
      setTimeout(() => {
        button.style.transform = 'scale(1)';
      }, 200);
    }
  };

  const handleGoHome = () => {
    if (homeLocation) {
      onLocationSelect(homeLocation.lng, homeLocation.lat, homeLocation.zoom);
      setIsOpen(false);
    }
  };

  const formatAddress = (feature: any) => {
    return feature.place_name.split(',').slice(0, 2).join(',');
  };

  const getLocationFromFeature = (feature: any): SavedLocation => {
    return {
      name: feature.text,
      address: formatAddress(feature),
      lat: feature.center[1],
      lng: feature.center[0],
      zoom: 15
    };
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Main Home Button */}
      <button
        data-home-button
        onClick={homeLocation ? handleGoHome : () => setIsOpen(true)}
        className={`group flex items-center space-x-2 px-4 py-3 rounded-2xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl border-2 ${
          homeLocation
            ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-white/20 hover:from-emerald-600 hover:to-teal-700'
            : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-white/20 hover:from-indigo-600 hover:to-purple-700'
        }`}
        title={homeLocation ? `Go to ${homeLocation.name}` : 'Set your home area'}
      >
        {homeLocation ? (
          <>
            <Home className="h-5 w-5" />
            <span className="hidden sm:inline font-semibold">Home</span>
          </>
        ) : (
          <>
            <MapPin className="h-5 w-5" />
            <span className="hidden sm:inline font-semibold">Find Area</span>
          </>
        )}
        
        {/* Settings icon for home location */}
        {homeLocation && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(true);
            }}
            className="p-1 rounded-lg hover:bg-white/20 transition-colors duration-200"
            title="Change home location"
          >
            <Settings className="h-3.5 w-3.5" />
          </button>
        )}
      </button>

      {/* Expanded Panel */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-3 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 z-50 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 flex items-center space-x-2">
                <Navigation className="h-5 w-5 text-indigo-600" />
                <span>Navigate to Area</span>
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 transition-colors duration-200"
              >
                <X className="h-4 w-4 text-slate-500" />
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {/* Home Location Section */}
            {homeLocation && (
              <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
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
                    onClick={handleGoHome}
                    className="bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors duration-200"
                  >
                    Go
                  </button>
                </div>
              </div>
            )}

            {/* Search Section */}
            <div className="p-4 border-b border-slate-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search address or neighborhood..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                {isSearching && (
                  <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-indigo-500 animate-spin" />
                )}
              </div>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="border-b border-slate-100">
                <div className="px-4 py-2">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Search Results</div>
                </div>
                {searchResults.map((feature, index) => {
                  const location = getLocationFromFeature(feature);
                  return (
                    <div key={index} className="px-4 py-2">
                      <div className="flex items-center justify-between group hover:bg-slate-50 rounded-xl p-2 transition-colors duration-200">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <MapPin className="h-4 w-4 text-slate-400 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-slate-800 truncate">{feature.text}</div>
                            <div className="text-sm text-slate-500 truncate">{formatAddress(feature)}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          {!homeLocation && (
                            <button
                              onClick={() => handleSetAsHome(location)}
                              className="p-1.5 rounded-lg hover:bg-emerald-100 text-emerald-600 transition-colors duration-200"
                              title="Set as home"
                            >
                              <Home className="h-3.5 w-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => handleLocationSelect(location)}
                            className="bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-600 transition-colors duration-200"
                          >
                            Go
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Recent Searches */}
            {recentSearches.length > 0 && searchQuery.length === 0 && (
              <div className="border-b border-slate-100">
                <div className="px-4 py-2 flex items-center justify-between">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>Recent</span>
                  </div>
                </div>
                {recentSearches.map((location, index) => (
                  <div key={index} className="px-4 py-2">
                    <div className="flex items-center justify-between group hover:bg-slate-50 rounded-xl p-2 transition-colors duration-200">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <Clock className="h-4 w-4 text-slate-400 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-slate-800 truncate">{location.name}</div>
                          <div className="text-sm text-slate-500 truncate">{location.address}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        {!homeLocation && (
                          <button
                            onClick={() => handleSetAsHome(location)}
                            className="p-1.5 rounded-lg hover:bg-emerald-100 text-emerald-600 transition-colors duration-200"
                            title="Set as home"
                          >
                            <Home className="h-3.5 w-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleLocationSelect(location)}
                          className="bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-600 transition-colors duration-200"
                        >
                          Go
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quick Areas */}
            {searchQuery.length === 0 && (
              <div>
                <div className="px-4 py-2">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center space-x-1">
                    <Star className="h-3 w-3" />
                    <span>Popular Areas</span>
                  </div>
                </div>
                {QUICK_AREAS.map((area, index) => (
                  <div key={index} className="px-4 py-2">
                    <div className="flex items-center justify-between group hover:bg-slate-50 rounded-xl p-2 transition-colors duration-200">
                      <div className="flex items-center space-x-3">
                        <Star className="h-4 w-4 text-amber-500 flex-shrink-0" />
                        <div className="font-medium text-slate-800">{area.name}</div>
                      </div>
                      <button
                        onClick={() => handleLocationSelect({
                          name: area.name,
                          address: area.name,
                          lat: area.lat,
                          lng: area.lng,
                          zoom: area.zoom
                        })}
                        className="bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-600 transition-colors duration-200"
                      >
                        Go
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {searchQuery.length >= 3 && searchResults.length === 0 && !isSearching && (
              <div className="p-8 text-center">
                <div className="text-slate-400 mb-2">
                  <Search className="h-8 w-8 mx-auto" />
                </div>
                <div className="text-sm text-slate-500">No results found for "{searchQuery}"</div>
                <div className="text-xs text-slate-400 mt-1">Try searching for a street address or neighborhood</div>
              </div>
            )}
          </div>

          {/* Footer Tip */}
          {!homeLocation && (
            <div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 border-t border-amber-100">
              <div className="flex items-center space-x-2 text-xs text-amber-700">
                <Home className="h-3.5 w-3.5 flex-shrink-0" />
                <span>💡 Set a home location for quick access to your neighborhood</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};