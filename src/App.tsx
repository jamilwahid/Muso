import { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FilterBar } from './components/FilterBar';
import { MapPlaceholder } from './components/MapPlaceholder';
import { useFilters } from './hooks/useFilters';
import { Center, Filters } from './types/center';
import centersData from './data/centers.json';

const defaultFoodOption = 'Halal Food Option Available';

function App() {
  const [centers] = useState<Center[]>(centersData as Center[]);
  const [filters, setFilters] = useState<Filters>({ dietary_services: [defaultFoodOption] });
  const { filteredCenters, availableOptions } = useFilters(centers, filters);

  return (
    <div className="flex h-[100dvh] min-h-0 flex-col overflow-hidden bg-[#faf9f4] text-[#20342b]">
      <main className="relative min-h-0 flex-1" aria-label="Childcare map">
        <MapPlaceholder centers={centers} filteredCount={filteredCenters.length} filteredCenters={filteredCenters} />
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[60] p-3 sm:p-4">
          <div className="flex min-w-0 flex-col items-start gap-2 md:flex-row md:items-center md:gap-3">
            <div className="pointer-events-auto shrink-0 rounded-2xl border border-[#dce8de] bg-[#fafbf7]/95 shadow-[0_2px_12px_rgba(32,52,43,0.12)] backdrop-blur">
              <Header />
            </div>
            <div className="pointer-events-auto max-w-full min-w-0">
              <FilterBar filters={filters} onFiltersChange={setFilters} availableOptions={availableOptions} />
            </div>
          </div>
          <p className="mt-2 inline-flex rounded-full border border-[#dce8de] bg-[#fafbf7]/95 px-3 py-1.5 text-xs font-medium text-[#355343] shadow-sm backdrop-blur" aria-live="polite">
            {filteredCenters.length.toLocaleString()} matching centres
          </p>
        </div>
      </main>
      <div className="hidden md:block"><Footer /></div>
    </div>
  );
}

export default App;
