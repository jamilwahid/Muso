import React, { useState } from 'react';
import { useEffect } from 'react';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { MapPlaceholder } from './components/MapPlaceholder';
import { ListView } from './components/ListView';
import { Footer } from './components/Footer';
import { useFilters } from './hooks/useFilters';
import { Center, Filters } from './types/center';
import centersData from './data/centers.json';

const defaultFoodOptions = ['Halal Food Option Available', 'Halal Centre'];

function App() {
  const [centers] = useState<Center[]>(centersData as Center[]);
  const [currentView, setCurrentView] = useState<'map' | 'list'>('map');
  const [filters, setFilters] = useState<Filters>({
    dietary_services: defaultFoodOptions
  });

  const { filteredCenters, availableOptions } = useFilters(centers, filters);

  useEffect(() => {
    localStorage.removeItem('muso-home-location');
  }, []);

  const clearAllFilters = () => {
    setFilters({ dietary_services: [] });
  };

  const hasActiveFilters = filters.dietary_services.length > 0;

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <div className="fixed top-0 left-0 right-0 z-40">
        <Header />
      </div>

      <div className="fixed top-[89px] left-0 right-0 z-30">
        <div className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60">
          <div className="px-6 py-5">
            <FilterBar
              filters={filters}
              onFiltersChange={setFilters}
              availableOptions={availableOptions}
            />
          </div>

          <div className="px-6 py-3 bg-white/40 backdrop-blur-sm border-b border-slate-200/40">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-center">
                <div className="text-sm font-medium text-slate-600">
                  {hasActiveFilters ? (
                    <>Showing {filteredCenters.length.toLocaleString()}/{centers.length.toLocaleString()} centers</>
                  ) : (
                    <>Showing {filteredCenters.length.toLocaleString()} centers</>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed top-[225px] left-0 right-0 bottom-[80px]">
        {currentView === 'map' ? (
          <div className="absolute inset-0 w-full h-full">
            <MapPlaceholder
              centers={centers}
              filteredCount={filteredCenters.length}
              filteredCenters={filteredCenters}
            />
          </div>
        ) : (
          <div className="absolute inset-0 w-full h-full">
            <ListView
              filteredCenters={filteredCenters}
              clearAllFilters={clearAllFilters}
            />
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-30">
        <Footer />
      </div>
    </div>
  );
}

export default App;