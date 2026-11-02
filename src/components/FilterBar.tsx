import { Button } from '@heroui/react';
import { Check } from 'lucide-react';
import { Filters } from '../types/center';

interface FilterBarProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  availableOptions: { dietaryServices: string[] };
}

const featuredOptions = [
  { value: 'Halal Food Option Available', label: 'Halal food' },
  { value: 'Vegetarian Food Option Available', label: 'Vegetarian' },
  { value: 'Vegan Food Option Available', label: 'Vegan' },
  { value: 'Pork-Free Menu', label: 'Pork-free' }
];

export function FilterBar({ filters, onFiltersChange }: FilterBarProps) {
  const selected = filters.dietary_services[0] || '';
  const select = (value: string) => onFiltersChange({
    ...filters,
    dietary_services: [value]
  });

  return (
    <div className="flex max-w-full gap-2 overflow-x-auto overscroll-x-contain scroll-px-3 px-3 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:px-4" aria-label="Food options">
      {featuredOptions.map(option => {
        const active = selected === option.value;
        return (
          <Button key={option.label} aria-pressed={active} onPress={() => select(option.value)}
            className={`h-11 shrink-0 rounded-full border px-4 text-sm font-semibold ${active ? 'border-[#175d3e] bg-[#175d3e] text-white' : 'border-[#cbdad0] bg-white text-[#355343]'}`}>
            {active && <Check size={16} />} {option.label}
          </Button>
        );
      })}
    </div>
  );
}
