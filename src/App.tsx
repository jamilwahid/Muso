```tsx
import React, { useState } from 'react';
import { useEffect } from 'react';
import { LeftSidebar } from './components/LeftSidebar'; // New import
import { FilterBar } from './components/FilterBar';
import { MapPlaceholder } from './components/MapPlaceholder';
import { ShortlistView } from './components/ShortlistView';
import { Footer } from './components/Footer';
import { useFilters } from './hooks/useFilters';
import { Center, Filters } from './types/center';
import { useFavorites } from './contexts/FavoritesContext';
import centersData from './data/centers.json';

function App() {
  const [centers] = useState<Center[]>(centersData as Center[]);
  const [currentView, setCurrentView] = useState<'map' | 'shortlist'>('map'); // Updated type
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
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30"> {/* Changed to flex */}
      {/* Left Sidebar */}
      <LeftSidebar currentView={currentView} setCurrentView={setCurrentView} />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden"> {/* Added flex-1 flex flex-col */}
        {/* Filter Bar with Summary - Now part of main content flow */}
        {currentView !== 'shortlist' && (
          <div className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 py-5 px-6"> {/* Removed fixed, top */}
            <div className="max-w-7xl mx-auto">
              <FilterBar
                filters={filters}
                onFiltersChange={setFilters}
                availableOptions={availableOptions}
              />
            </div>
          </div>
        )}
        
        {/* Summary Section - Only show for map view */}
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
      
        {/* Main View Content */}
        <div className="flex-1 overflow-y-auto"> {/* Changed to flex-1 overflow-y-auto */}
          {currentView === 'map' ? (
            /* Map View */
            <div className="h-full w-full"> {/* Removed absolute inset-0 */}
              <MapPlaceholder 
                centers={centers}
                filteredCount={filteredCenters.length} 
                filteredCenters={filteredCenters}
              />
            </div>
          ) : (
            /* Shortlist View */
            <div className="h-full w-full"> {/* Removed absolute inset-0 */}
              <ShortlistView 
                centers={centers}
                clearAllFilters={clearAllFilters}
              />
            </div>
          )}
        </div>
        
        {/* Fixed Footer */}
        <div className="flex-shrink-0"> {/* Added flex-shrink-0 */}
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default App;
```