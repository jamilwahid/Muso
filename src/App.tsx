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

const defaultHalalTags = ['Halal Food Option Available', 'Halal Centre'];

const defaultFilters: Filters = {
  dietary_services: defaultHalalTags,
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

  const isDefaultFoodSelection =
    filters.dietary_services.length === defaultHalalTags.length &&
    defaultHalalTags.every(tag => filters.dietary_services.includes(tag));

  const hasCustomizedFilters =
    !isDefaultFoodSelection ||
    filters.CWELCC_participant === true ||
    filters.subsidy_available === true ||
    filters.age_groups.length > 0 ||
    filters.location_query.length > 0;

  const resultLabel = filters.dietary_services.length > 0
    ? 'centres matching selected food options'
    : 'licensed centres in Toronto';

  return (
    <div className="flex min-h-screen flex-col bg-[#f7f5ef] text-[#202b24]">
      <Header />
      <main className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col px-4 sm:px-6">
        <section className="flex flex-wrap items-end justify-between gap-4 py-5">
          <div>
            <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#a75b3e]">
              Childcare search · Toronto
            </p>
            <h1 className="max-w-4xl text-[30px] font-semibold leading-[1.08] tracking-[-0.045em] sm:text-[40px]">
              Find childcare that fits your family’s food needs.
            </h1>
            <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-[#606b62] sm:text-[15px]">
              Explore Toronto centres by the food options in their City listing, then confirm details directly with each centre.
            </p>
          </div>
          <div className="rounded-full border border-[#d5e4d5] bg-[#eaf4e9] px-3.5 py-2 text-xs font-semibold text-[#20573d]">
            {filteredCenters.length.toLocaleString()} matching centres
          </div>
        </section>

        <section aria-label="Food options and childcare filters" className="mb-3 rounded-2xl border border-[#dedacf] bg-[#fffdf8] p-3.5 shadow-[0_3px_14px_rgba(32,43,36,0.045)] sm:p-4">
          <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#a75b3e]">Food options</p>
              <h2 className="mt-1 text-base font-semibold tracking-[-0.02em] text-[#202b24]">Choose what matters to your family.</h2>
            </div>
            <p className="text-xs text-[#737d73]">Halal-related City tags are selected by default.</p>
          </div>
          <FilterBar filters={filters} onFiltersChange={setFilters} availableOptions={availableOptions} />
        </section>

        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p className="flex items-center gap-2 text-xs leading-relaxed text-[#606b62]">
            <Info className="h-4 w-4 shrink-0 text-[#176044]" />
            City tags are provider-reported, not certification. Confirm current food practices with each centre.
          </p>
          {hasCustomizedFilters && (
            <button type="button" onClick={resetFilters} className="shrink-0 text-xs font-semibold text-[#176044] underline decoration-[#a9c9ad] underline-offset-2">
              Reset search
            </button>
          )}
        </div>

        <div className="mb-6 grid flex-1 gap-3 lg:h-[70vh] lg:min-h-[560px] lg:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.8fr)] lg:gap-0 lg:overflow-hidden lg:rounded-2xl lg:border lg:border-[#dedacf] lg:bg-[#fffdf8] lg:shadow-[0_4px_18px_rgba(32,43,36,0.055)]">
          <MapView
            centers={filteredCenters}
            selectedCenterId={selectedCenterId}
            hasSelectedFoodOptions={filters.dietary_services.length > 0}
            onSelectCenter={setSelectedCenterId}
          />

          <aside aria-label="Childcare results" className="min-h-[360px] lg:min-h-0 lg:overflow-y-auto">
            <div className="sticky top-0 z-20 border-b border-[#e8e3d9] bg-[#fffdf8]/95 px-4 py-3 backdrop-blur">
              <p className="text-sm font-semibold text-[#202b24]">
                {filteredCenters.length.toLocaleString()} {resultLabel}
              </p>
            </div>
            {filteredCenters.length === 0 ? (
              <div className="flex h-full min-h-[260px] flex-col items-center justify-center px-6 py-10 text-center">
                <h2 className="font-semibold">No centres match those filters</h2>
                <p className="mt-2 text-sm text-[#606b62]">Try another food option, a nearby area, or clear a filter.</p>
                <button type="button" onClick={resetFilters} className="mt-4 rounded-xl bg-[#176044] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#124b36]">
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