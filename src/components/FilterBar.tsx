import { Button, Modal } from '@heroui/react';
import { Check, SlidersHorizontal } from 'lucide-react';
import { Filters } from '../types/center';

interface FilterBarProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  availableOptions: { dietaryServices: string[] };
}

const featuredOptions = [
  { value: 'Halal Food Option Available', label: 'Halal food option' },
  { value: 'Halal Centre', label: 'Halal centre' },
  { value: 'Vegetarian Food Option Available', label: 'Vegetarian' },
  { value: 'Pork-Free Menu', label: 'Pork-free' }
];
const additionalOptions = [
  { value: 'Vegan Food Option Available', label: 'Vegan food option' },
  { value: 'Kosher Food Option Available', label: 'Kosher food option' },
  { value: 'Kosher Centre', label: 'Kosher centre' }
];

export function FilterBar({ filters, onFiltersChange, availableOptions }: FilterBarProps) {
  const moreOptions = additionalOptions.filter(option => availableOptions.dietaryServices.includes(option.value));
  const count = moreOptions.filter(option => filters.dietary_services.includes(option.value)).length;
  const toggle = (value: string) => onFiltersChange({
    ...filters,
    dietary_services: filters.dietary_services.includes(value)
      ? filters.dietary_services.filter(item => item !== value)
      : [...filters.dietary_services, value]
  });

  return (
    <div className="flex gap-2 overflow-x-auto px-4 py-3 sm:px-6" aria-label="Food options">
      {featuredOptions.map(option => {
        const active = filters.dietary_services.includes(option.value);
        return (
          <Button key={option.value} aria-pressed={active} onPress={() => toggle(option.value)}
            className={`h-11 shrink-0 rounded-full border px-4 text-sm font-semibold ${active ? 'border-[#175d3e] bg-[#175d3e] text-white' : 'border-[#cbdad0] bg-white text-[#355343]'}`}>
            {active && <Check size={16} />} {option.label}
          </Button>
        );
      })}
      <Modal>
        <Button className="h-11 shrink-0 rounded-full border border-[#cbdad0] bg-white px-4 text-sm font-semibold text-[#355343]">
          <SlidersHorizontal size={16} /> More filters{count > 0 ? ` · ${count}` : ''}
        </Button>
        <Modal.Backdrop>
          <Modal.Container className="items-end sm:items-center">
            <Modal.Dialog className="w-full rounded-t-[28px] bg-[#fafbf7] p-5 sm:max-w-md sm:rounded-[28px]">
              <Modal.CloseTrigger />
              <Modal.Header><Modal.Heading className="text-xl font-semibold text-[#17392a]">More food options</Modal.Heading></Modal.Header>
              <Modal.Body>
                <p className="mb-2 text-sm text-[#5b7063]">Centres matching any selected food option will appear.</p>
                {moreOptions.map(option => (
                  <label key={option.value} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl px-2 text-sm text-[#243f30] hover:bg-[#edf4ed]">
                    <input type="checkbox" checked={filters.dietary_services.includes(option.value)} onChange={() => toggle(option.value)} className="h-5 w-5 accent-[#175d3e]" />
                    {option.label}
                  </label>
                ))}
              </Modal.Body>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
}
