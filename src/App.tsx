import React, { useState } from 'react';
import { useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { MapPlaceholder } from './components/MapPlaceholder';
import { CenterCard } from './components/CenterCard';
import { Footer } from './components/Footer';
import { OnboardingTour } from './components/OnboardingTour';
import { useFilters } from './hooks/useFilters';
import { Center, Filters } from './types/center';
import centersData from './data/centers.json';

function App() {
  const [centers] = useState<Center[]>(centersData as Center[]);
  const [currentView, setCurrentView] = useState<'map' | 'list'>('map');
  const [showOnboarding, setShowOnboarding] = useState(false);
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

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    localStorage.setItem('muso-onboarding-completed', 'true');
  };

  const handleOnboardingSkip = () => {
    setShowOnboarding(false);
    localStorage.setItem('muso-onboarding-completed', 'true');
  };

  const handleShowOnboarding = () => {
    setShowOnboarding(true);
  };

  // Check if user should see onboarding on first visit
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('muso-onboarding-completed') === 'true';
    if (!hasSeenOnboarding) {
      // Delay showing onboarding to let the app load
      const timer = setTimeout(() => {
        setShowOnboarding(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      {/* Onboarding Tour */}
      <OnboardingTour
        isVisible={showOnboarding}
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingSkip}
      />
      
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-40">
        <Header onShowOnboarding={handleShowOnboarding} />
      </div>
      
      {/* Fixed Filter Bar with Summary */}
      <div className="fixed top-[89px] left-0 right-0 z-30" data-onboarding="filter-bar">
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
          <div className="px-6 py-2.5 bg-white/40 backdrop-blur-sm border-b border-slate-200/40">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between">
                {/* Results count */}
                <div className="text-sm font-medium text-slate-600">
                  {hasActiveFilters ? (
                    <>Showing {filteredCenters.length.toLocaleString()}/{centers.length.toLocaleString()} centers</>
                  ) : (
                    <>Showing {centers.length.toLocaleString()} centers</>
                  )}
                </div>
                
                {/* View Switcher */}
                <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-xl p-1 shadow-sm border border-slate-200/60">
                  <button
                    onClick={() => setCurrentView('map')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      currentView === 'map'
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <MapPin className="h-4 w-4" />
                    <span>Map</span>
                  </button>
                  <button
                    onClick={() => setCurrentView('list')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      currentView === 'list'
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    <span>List</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content Area - Adjusted top position */}
      <div className="fixed top-[239px] left-0 right-0 bottom-[80px]">
        {currentView === 'map' ? (
          /* Map View */
          <div className="h-full w-full" data-onboarding="map-area">
            <MapPlaceholder 
              centers={centers}
              filteredCount={filteredCenters.length} 
              filteredCenters={filteredCenters}
            />
          </div>
        ) : (
          /* List View */
          <div className="h-full w-full bg-gradient-to-br from-white/80 via-indigo-50/40 to-purple-50/30 backdrop-blur-sm overflow-y-auto">
            <div className="px-6 lg:px-8 max-w-7xl mx-auto py-8">
              {filteredCenters.length === 0 ? (
                <div className="text-center py-20">
                  <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/30 max-w-lg mx-auto">
                    <div className="text-slate-400 mb-6">
                      <div className="w-24 h-24 mx-auto bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 rounded-full flex items-center justify-center shadow-inner">
                        <span className="text-4xl">🔍</span>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-4">No centers match your filters</h3>
                    <p className="text-slate-600 mb-8 leading-relaxed text-lg">Try adjusting your search criteria to discover more options that fit your family's unique needs.</p>
                    <button
                      onClick={clearAllFilters}
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
                    >
                      Explore All Centers
                    </button>
                  </div>
                </div>
              ) : (
                <>

                  {/* Grid Layout */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                    {filteredCenters.map((center, index) => (
                      <div 
                        key={center.center_id}
                        className="transform transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1"
                        style={{
                          animationDelay: `${index * 50}ms`
                        }}
                      >
                        <CenterCard center={center} />
                      </div>
                    ))}
                  </div>

                  {/* Inspirational Footer */}
                  {filteredCenters.length > 0 && (
                    <div className="mt-16 text-center">
                      <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-white/30 max-w-2xl mx-auto">
                        <div className="space-y-4">
                          <div className="text-4xl mb-4">✨</div>
                          <h3 className="text-xl font-bold text-slate-800">
                            Found Your Perfect Match?
                          </h3>
                          <p className="text-slate-600 leading-relaxed">
                            Remember to call centers directly - many have more availability than shown online. 
                            Visit in person when possible to get the full picture!
                          </p>
                          <div className="flex items-center justify-center space-x-2 text-sm text-indigo-600 font-medium">
                            <span>💡</span>
                            <span>Pro tip: Ask about waitlist positions and upcoming openings</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
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