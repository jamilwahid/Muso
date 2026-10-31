import React, { useState } from 'react';
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
  postal_codes: []
};

function App() {
  const [centers] = useState<Center[]>(centersData as Center[]);
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [selectedCenterId, setSelectedCenterId] = useState<string | null>(null);
  const { filteredCenters, availableOptions } = useFilters(centers, filters);

  const resetFilters = () => setFilters(defaultFilters);
  const hasAdditionalFilters =
    filters.CWELCC_participant === true ||
    filters.subsidy_available === true ||
    filters.age_groups.length > 0 ||
    filters.postal_codes.length > 0;

  const description = filters.halal_listed
    ? 'with a halal-related tag in the City listing'
    : 'in the City directory';

  return (
    <div className="flex min-h-screen flex-col bg-stone-50 text-slate-900">
      <Header />
      <main className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col px-4 sm:px-6">
        <section className="flex flex-wrap items-end justify-between gap-4 py-5">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-emerald-800">
              Toronto · Free childcare finder
            </p>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Find halal childcare near you
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-slate-600">
              Explore centres whose City listing includes halal information. Confirm current food practices directly with each centre.
            </p>
          </div>
          <div className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-900">
            {filteredCenters.length.toLocaleString()} {filters.halal_listed ? 'halal-tagged' : 'listed'} centres
          </div>
        </section>

        <section aria-label="Search filters" className="mb-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
          <FilterBar filters={filters} onFiltersChange={setFilters} availableOptions={availableOptions} />
        </section>

        <section className="mb-2 flex items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold text-slate-900">Childcare near you</h3>
            <p className="text-xs text-slate-500">
              {filteredCenters.length.toLocaleString()} {filteredCenters.length === 1 ? 'centre' : 'centres'} {description}
            </p>
          </div>
          {(hasAdditionalFilters || !filters.halal_listed) && (
            <button type="button" onClick={resetFilters} className="text-sm font-semibold text-emerald-800 underline underline-offset-2">
              Reset to halal listings
            </button>
          )}
        </section>

        <div className="mb-6 grid flex-1 gap-4 lg:h-[72vh] lg:min-h-[560px] lg:grid-cols-[minmax(0,1.3fr)_minmax(360px,0.8fr)] lg:gap-0 lg:overflow-hidden lg:rounded-2xl lg:border lg:border-slate-200 lg:bg-white lg:shadow-sm">
          <MapView
            centers={filteredCenters}
            selectedCenterId={selectedCenterId}
            halalOnly={filters.halal_listed}
            onSelectCenter={setSelectedCenterId}
          />

          <aside aria-label="Childcare results" className="min-h-[360px] lg:min-h-0 lg:overflow-y-auto lg:bg-white">
            {filteredCenters.length === 0 ? (
              <div className="flex h-full min-h-[260px] flex-col items-center justify-center px-6 py-10 text-center">
                <h4 className="font-semibold">No centres match those filters</h4>
                <p className="mt-2 text-sm text-slate-600">Try a nearby area or clear one of the filters.</p>
                <button type="button" onClick={resetFilters} className="mt-4 rounded-lg bg-emerald-800 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-900">
                  Show halal listings
                </button>
              </div>
            ) : (
              <div className="space-y-3 p-1 lg:p-4">
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