import React, { useState } from 'react';
import { useEffect } from 'react';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { MapPlaceholder } from './components/MapPlaceholder';
import { ListView } from './components/ListView';
import { ShortlistView } from './components/ShortlistView';
import { Footer } from './components/Footer';
import { useFilters } from './hooks/useFilters';
import { Center, Filters } from './types/center';
import { useFavorites } from './contexts/FavoritesContext';
import centersData from './data/centers.json';

function App() {
  const [centers] = useState<Center[]>(centersData as Center[]);
  const [currentView, setCurrentView] = useState<'map' | 'list' | 'shortlist'>('map');
  const [filters, setFilters] = useState<Filters>({
    CWELCC_participant: null,
    subsidy_available: null,
    languages_spoken: [],
    dietary_services: []
  });

  const { favoritesCount } = useFavorites();
  const { filteredCenters, availableOptions } = useFilters(centers, filters);

  // Calculate centers with infant programs for accurate count display
  const centersWithInfantPrograms = centers.filter(center => 
    center.programs.some(p => p.age_group.toLowerCase().includes('infant'))
  );

  const clearAllFilters = () => {
    setFilters({
      CWELCC_participant: null,
      subsidy_available: null,
      languages_spoken: [],
      dietary_services: []
    });
  };

  const hasActiveFilters = filters.CWELCC_participant !== null || 
                          filters.subsidy_available !== null ||
                          filters.languages_spoken.length > 0 ||
                          filters.dietary_services.length > 0;


  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-40">
        <Header />
      </div>
      
      {/* Fixed Filter Bar with Summary */}
      <div className="fixed top-[89px] left-0 right-0 z-30 bg-white/90 backdrop-blur-xl border-b border-slate-200/60">
        {/* View Navigation */}
        <div className="px-6 py-4 border-b border-slate-200/40">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={() => setCurrentView('map')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  currentView === 'map'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                Map View
              </button>
              <button
                onClick={() => setCurrentView('list')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  currentView === 'list'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                List View
              </button>
              <button
                onClick={() => setCurrentView('shortlist')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 relative ${
                  currentView === 'shortlist'
                    ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                My Shortlist
                {favoritesCount > 0 && (
                  <div className={`absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-xs font-bold shadow-sm ${
                    currentView === 'shortlist'
                      ? 'bg-white text-pink-600'
                      : 'bg-pink-500 text-white'
                  }`}>
                    {favoritesCount}
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Filter Controls - Only show for map and list views */}
        {currentView !== 'shortlist' && (
          <div className="px-6 py-5">
            <FilterBar
              filters={filters}
              onFiltersChange={setFilters}
              availableOptions={availableOptions}
            />
          </div>
        )}
        
        {/* Summary Section - Only show for map and list views */}
        {currentView !== 'shortlist' && (
          <div className="px-6 py-3 bg-white/40 backdrop-blur-sm border-b border-slate-200/40">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-center">
                {/* Results count */}
                <div className="text-sm font-medium text-slate-600">
                  {hasActiveFilters ? (
                    <>Showing {filteredCenters.length.toLocaleString()}/{centersWithInfantPrograms.length.toLocaleString()} centers</>
                  ) : (
                    <>Showing {filteredCenters.length.toLocaleString()} centers</>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Main Content Area - Adjusted top position based on view */}
      <div className={`fixed left-0 right-0 bottom-[80px] ${
        currentView === 'shortlist' ? 'top-[157px]' : 'top-[225px]'
      }`}>
        {currentView === 'map' ? (
          /* Map View */
          <div className="absolute inset-0 w-full h-full">
            <MapPlaceholder 
              centers={centers}
              filteredCount={filteredCenters.length} 
              filteredCenters={filteredCenters}
            />
          </div>
        ) : currentView === 'list' ? (
          /* List View */
          <div className="absolute inset-0 w-full h-full">
            <ListView 
              filteredCenters={filteredCenters}
              clearAllFilters={clearAllFilters}
            />
          </div>
        ) : (
          /* Shortlist View */
          <div className="absolute inset-0 w-full h-full">
            <ShortlistView 
              centers={centers}
              clearAllFilters={clearAllFilters}
            />
          </div>
        )}
      </div>
      
      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-30">
        <Footer />
      </div>
    </div>
  );
}

export default App;