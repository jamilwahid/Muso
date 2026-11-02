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
      <Header />
      <section aria-label="Food filters" className="shrink-0 border-b border-[#dce8de] bg-[#fafbf7]">
        <FilterBar filters={filters} onFiltersChange={setFilters} availableOptions={availableOptions} />
        <div className="flex items-center justify-between gap-3 px-4 pb-3 sm:px-6">
          <p className="text-xs font-medium text-[#5b7063]" aria-live="polite">
            <span className="font-semibold text-[#234d38]">{filteredCenters.length.toLocaleString()} centres</span> · Toronto
          </p>
        </div>
      </section>
      <main className="relative min-h-0 flex-1">
        <MapPlaceholder centers={centers} filteredCount={filteredCenters.length} filteredCenters={filteredCenters} />
      </main>
      <Footer />
    </div>
  );
}

export default App;
