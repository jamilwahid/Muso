import React, { useState } from 'react';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { MapPlaceholder } from './components/MapPlaceholder';
import { CenterCard } from './components/CenterCard';
import { Footer } from './components/Footer';
import { useFilters } from './hooks/useFilters';
import { Center, Filters } from './types/center';
import centersData from './data/centers.json';

function App() {
  const [centers] = useState<Center[]>(centersData as Center[]);
  const [filters, setFilters] = useState<Filters>({
    CWELCC_participant: null,
    subsidy_available: null,
    age_groups: [],
    languages_spoken: [],
    dietary_services: [],
    postal_codes: []
  });

  const { filteredCenters, availableOptions } = useFilters(centers, filters);

  const clearAllFilters = () => {
    setFilters({
      CWELCC_participant: null,
      subsidy_available: null,
      age_groups: [],
      languages_spoken: [],
      dietary_services: [],
      postal_codes: []
    });
  };

  const hasActiveFilters = filters.CWELCC_participant !== null || 
                          filters.subsidy_available !== null ||
                          filters.age_groups.length > 0 ||
                          filters.languages_spoken.length > 0 ||
                          filters.dietary_services.length > 0 ||
                          filters.postal_codes.length > 0;

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-40">
        <Header />
      </div>
      
      {/* Fixed Filter Bar with Summary */}
      <div className="fixed top-[89px] left-0 right-0 z-30">
        <div className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60">
          {/* Filter Controls */}
          <div className="px-6 py-5">
            <FilterBar
              filters={filters}
              onFiltersChange={setFilters}
              availableOptions={availableOptions}
            />
          </div>
          
          {/* Summary Section */}
          <div className="px-6 py-2.5 bg-white/40 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto">
              <div className="text-center">
                <div className="text-sm font-medium text-slate-600">
                  {hasActiveFilters ? (
                    <>Showing {filteredCenters.length.toLocaleString()}/{centers.length.toLocaleString()} centers</>
                  ) : (
                    <>Showing {centers.length.toLocaleString()} centers</>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content Area - Adjusted top position */}
      <div className="fixed top-[209px] left-0 right-0 bottom-[80px] flex">
        {/* Map Section - 60% - Fixed */}
        <div className="w-3/5 border-r border-slate-200/60 h-full">
          <MapPlaceholder filteredCount={filteredCenters.length} />
        </div>

        {/* Results Section - 40% - Only this scrolls */}
        <div className="w-2/5 bg-white/60 backdrop-blur-sm h-full overflow-y-auto">
          <div className="p-6">
            {filteredCenters.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20 max-w-md mx-auto">
                  <div className="text-slate-400 mb-6">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center shadow-inner">
                      <span className="text-3xl">🔍</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">No centers match your filters</h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">Try adjusting your search criteria to see more results that fit your family's needs.</p>
                  <button
                    onClick={clearAllFilters}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-2xl font-bold hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Show all centers
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredCenters.map(center => (
                  <CenterCard
                    key={center.center_id}
                    center={center}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-30">
        <Footer />
      </div>
    </div>
  );
}

export default App;