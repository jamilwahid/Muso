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
        <div className="bg-slate-50/95 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
          {/* Filter Controls */}
          <div className="px-6 py-6">
            <FilterBar
              filters={filters}
              onFiltersChange={setFilters}
              availableOptions={availableOptions}
            />
          </div>
          
          {/* Summary Section */}
          <div className="px-6 py-3 bg-white/60 backdrop-blur-sm border-t border-slate-200/40">
            <div className="max-w-7xl mx-auto">
              <div className="text-center">
                <div className="text-sm font-medium text-slate-600">
                  {hasActiveFilters ? (
                    <>Showing {filteredCenters.filter(c => c.location.latitude && c.location.longitude).length.toLocaleString()} of {centers.filter(c => c.location.latitude && c.location.longitude).length.toLocaleString()} centers on map</>
                  ) : (
                    <>Showing {centers.filter(c => c.location.latitude && c.location.longitude).length.toLocaleString()} centers on map</>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content Area - Adjusted top position */}
      <div className="fixed top-[219px] left-0 right-0 bottom-[80px]">
        {/* Map Section - Full width and height */}
        <div className="w-full h-full">
          <MapPlaceholder 
            centers={centers}
            filteredCount={filteredCenters.length} 
            filteredCenters={filteredCenters}
          />
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