import { useState } from 'react';
import { Button } from '@heroui/react';
import { List, Map as MapIcon } from 'lucide-react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FilterBar } from './components/FilterBar';
import { MapPlaceholder } from './components/MapPlaceholder';
import { ListView } from './components/ListView';
import { useFilters } from './hooks/useFilters';
import { Center, Filters } from './types/center';
import centersData from './data/centers.json';

function App() {
  const [centers] = useState<Center[]>(centersData as Center[]);
  const [currentView, setCurrentView] = useState<'map' | 'list'>('map');
  const [filters, setFilters] = useState<Filters>({ dietary_services: [] });
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
          <Button size="sm" variant="tertiary" onPress={() => setCurrentView(currentView === 'map' ? 'list' : 'map')} className="h-9 rounded-full px-3 text-xs font-semibold text-[#165b3c]">
            {currentView === 'map' ? <><List size={16} /> View list</> : <><MapIcon size={16} /> View map</>}
          </Button>
        </div>
      </section>
      <main className="relative min-h-0 flex-1">
        {currentView === 'map' ? (
          <MapPlaceholder centers={centers} filteredCount={filteredCenters.length} filteredCenters={filteredCenters} />
        ) : (
          <ListView filteredCenters={filteredCenters} clearAllFilters={() => setFilters({ dietary_services: [] })} />
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;
