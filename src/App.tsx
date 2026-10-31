import React, { useEffect, useState } from 'react';
import { Info } from 'lucide-react';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { MapView } from './components/MapView';
import { CenterCard } from './components/CenterCard';
import { Footer } from './components/Footer';
import { useFilters } from './hooks/useFilters';
import { Center, Filters } from './types/center';
import centersData from './data/centers.json';

const defaultFilters: Filters = {
  halal_listed: true,
  CWELCC_participant: null,
  subsidy_available: null,
  age_groups: [],
  location_query: ''
};

function App() {
  const [centers] = useState<Center[]>(centersData as Center[]);
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [selectedCenterId, setSelectedCenterId] = useState<string | null>(null);
  const { filteredCenters, availableOptions } = useFilters(centers, filters);

  useEffect(() => {
    if (selectedCenterId && !filteredCenters.some(center => center.center_id === selectedCenterId)) {
      setSelectedCenterId(null);
    }
  }, [filteredCenters, selectedCenterId]);

  useEffect(() => {
    if (selectedCenterId) {
      document.getElementById(`center-${selectedCenterId}`)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [selectedCenterId]);

  const resetFilters = () => {
    setFilters(defaultFilters);
    setSelectedCenterId(null);
  };

  const hasAdditionalFilters =
    filters.CWELCC_participant === true ||
    filters.subsidy_available === true ||
    filters.age_groups.length > 0 ||
    filters.location_query.length > 0;

  const resultLabel = filters.halal_listed
    ? 'centres with halal information in the City listing'
    : 'licensed centres in Toronto';

  return (
    <div className="flex min-h-screen flex-col bg-[#f6f5ef] text-[#1c2f29]">
      <Header />
      <main className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col px-4 sm:px-6">
        <section className="flex flex-wrap items-end justify-between gap-4 py-5">
          <div>
            <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#587365]">
              Childcare search · Toronto
            </p>
            <h1 className="text-[28px] font-semibold leading-tight tracking-[-0.03em] sm:text-[34px]">
              Find daycares with halal food information.
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-slate-600">
              Explore the map, see what each City listing says, and contact centres about their current food practices.
            </p>
          </div>
          <div className="rounded-full border border-[#d6e3d9] bg-[#edf4ee] px-3.5 py-2 text-xs font-semibold text-[#214f40]">
            {filteredCenters.length.toLocaleString()} {filters.halal_listed ? 'halal-tagged' : 'listed'} centres
          </div>
        </section>

        <section aria-label="Search filters" className="mb-3 rounded-xl border border-[#e4e0d6] bg-[#fbfaf6] p-3 shadow-[0_1px_2px_rgba(25,40,31,0.04)] sm:p-3.5">
          <FilterBar filters={filters} onFiltersChange={setFilters} availableOptions={availableOptions} />
        </section>

        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p className="flex items-center gap-2 text-xs leading-relaxed text-slate-600">
            <Info className="h-4 w-4 shrink-0 text-[#6c8475]" />
            City tags are a starting point, not certification. Confirm current food practices with each centre.
          </p>
          {(hasAdditionalFilters || !filters.halal_listed) && (
            <button type="button" onClick={resetFilters} className="shrink-0 text-xs font-semibold text-[#214f40] underline underline-offset-2">
              Reset search
            </button>
          )}
        </div>

        <div className="mb-6 grid flex-1 gap-3 lg:h-[70vh] lg:min-h-[560px] lg:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.8fr)] lg:gap-0 lg:overflow-hidden lg:rounded-xl lg:border lg:border-[#dedbd1] lg:bg-[#fbfaf6] lg:shadow-sm">
          <MapView
            centers={filteredCenters}
            selectedCenterId={selectedCenterId}
            halalOnly={filters.halal_listed}
            onSelectCenter={setSelectedCenterId}
          />

          <aside aria-label="Childcare results" className="min-h-[360px] lg:min-h-0 lg:overflow-y-auto">
            <div className="sticky top-0 z-20 border-b border-[#e8e4db] bg-[#fbfaf6]/95 px-4 py-3 backdrop-blur">
              <p className="text-sm font-semibold text-[#243b32]">
                {filteredCenters.length.toLocaleString()} {resultLabel}
              </p>
            </div>
            {filteredCenters.length === 0 ? (
              <div className="flex h-full min-h-[260px] flex-col items-center justify-center px-6 py-10 text-center">
                <h2 className="font-semibold">No centres match those filters</h2>
                <p className="mt-2 text-sm text-slate-600">Try a nearby neighbourhood or clear a filter.</p>
                <button type="button" onClick={resetFilters} className="mt-4 rounded-lg bg-[#214f40] px-4 py-2 text-sm font-semibold text-white hover:bg-[#173d30]">
                  Reset search
                </button>
              </div>
            ) : (
              <div className="space-y-2.5 p-3">
                {filteredCenters.map(center => (
                  <CenterCard
                    key={center.center_id}
                    center={center}
                    isSelected={center.center_id === selectedCenterId}
                    onSelect={() => setSelectedCenterId(center.center_id)}
                  />
                ))}
              </div>
            )}
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;