import React, { useState } from 'react';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
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
    <div className="min-h-screen bg-stone-50 text-slate-900">
      <Header />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
        <section className="mb-7 max-w-3xl">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-emerald-800">
            Free childcare finder for Toronto families
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Find childcare with halal information
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600">
            Start with centres whose City of Toronto listing includes a halal-related tag. Open the original listing and confirm current food practices directly with each centre.
          </p>
        </section>

        <section aria-label="Search filters" className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-3">
            <h3 className="font-semibold text-slate-900">Find a centre that fits</h3>
            <p className="mt-1 text-sm text-slate-600">
              Halal tags are shown by default. Turn the filter off to browse all listed centres.
            </p>
          </div>
          <FilterBar filters={filters} onFiltersChange={setFilters} availableOptions={availableOptions} />
        </section>

        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-lg font-semibold text-slate-900">
              {filteredCenters.length.toLocaleString()} {filteredCenters.length === 1 ? 'centre' : 'centres'}
            </p>
            <p className="text-sm text-slate-600">{description}</p>
          </div>
          {(hasAdditionalFilters || !filters.halal_listed) && (
            <button type="button" onClick={resetFilters} className="text-sm font-semibold text-emerald-800 underline underline-offset-2">
              Reset to halal listings
            </button>
          )}
        </div>

        {filteredCenters.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center">
            <h3 className="text-lg font-semibold">No centres match those filters</h3>
            <p className="mt-2 text-sm text-slate-600">Try a nearby area or clear one of the filters.</p>
            <button type="button" onClick={resetFilters} className="mt-4 rounded-lg bg-emerald-800 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-900">
              Show halal listings
            </button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredCenters.map(center => (
              <CenterCard key={center.center_id} center={center} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;