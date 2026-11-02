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
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-[55] h-40 bg-gradient-to-b from-[#fafbf7]/95 via-[#fafbf7]/70 to-transparent md:hidden" />
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[60] p-3 sm:p-4">
          <div className="flex min-w-0 flex-col items-center gap-2">
            <div className="pointer-events-auto shrink-0 rounded-2xl border border-[#dce8de] bg-[#fafbf7]/95 shadow-[0_2px_12px_rgba(32,52,43,0.12)] backdrop-blur">
              <Header />
            </div>
            <div className="pointer-events-auto max-w-full min-w-0 self-start md:self-center">
              <FilterBar filters={filters} onFiltersChange={setFilters} availableOptions={availableOptions} />
            </div>
          </div>
        </div>
      </main>
      <div className="hidden md:block"><Footer /></div>
    </div>
  );
}

export default App;
