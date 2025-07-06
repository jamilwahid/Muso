import React, { useState } from 'react';
import { useEffect } from 'react';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { MapPlaceholder } from './components/MapPlaceholder';
import { ListView } from './components/ListView';
import { ViewSwitcher } from './components/ViewSwitcher';
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
          <div className="px-6 py-3 bg-white/40 backdrop-blur-sm border-b border-slate-200/40">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-center">
                {/* Results count */}
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
      <div className="fixed top-[225px] left-0 right-0 bottom-[80px]">
        {/* View Switcher - Floating on content area */}
        <ViewSwitcher 
          currentView={currentView}
          onViewChange={setCurrentView}
        />
        
        {currentView === 'map' ? (
          /* Map View */
          <div className="absolute inset-0 w-full h-full" data-onboarding="map-area">
            <MapPlaceholder 
              centers={centers}
              filteredCount={filteredCenters.length} 
              filteredCenters={filteredCenters}
            />
          </div>
        ) : (
          /* List View */
          <div className="absolute inset-0 w-full h-full">
          <ListView 
            filteredCenters={filteredCenters}
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