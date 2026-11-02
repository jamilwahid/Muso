import { useRef } from 'react';
import { Button } from '@heroui/react';
import { Leaf, Utensils } from 'lucide-react';
import { Filters } from '../types/center';

interface FilterBarProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  availableOptions: { dietaryServices: string[] };
}

const PorkFreeIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12a7.5 7.5 0 0 1 12.8-5.3L20 6v3.1a7 7 0 0 1 1 3.7v1.1l-2.3.8a7.5 7.5 0 0 1-2.1 2.7V20h-2.5l-.7-1.3H9L8.3 20H6v-3.1A7.6 7.6 0 0 1 4 12Z" />
    <path d="M17.5 11h.01M2.5 3l19 18" />
  </svg>
);

const featuredOptions = [
  { value: 'Halal Food Option Available', label: 'Halal options', Icon: Utensils },
  { value: 'Vegetarian Food Option Available', label: 'Vegetarian options', Icon: Leaf },
  { value: 'Pork-Free Menu', label: 'Pork-free menu', Icon: PorkFreeIcon }
];

export function FilterBar({ filters, onFiltersChange }: FilterBarProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const selected = filters.dietary_services[0] || '';
  const revealPill = (pill: Element) => {
    const row = rowRef.current;
    if (!row) return;
    const rowBounds = row.getBoundingClientRect();
    const pillBounds = pill.getBoundingClientRect();
    const inset = 4;
    const leftOverflow = pillBounds.left - rowBounds.left - inset;
    const rightOverflow = pillBounds.right - rowBounds.right + inset;
    const distance = leftOverflow < 0 ? leftOverflow : rightOverflow > 0 ? rightOverflow : 0;
    if (!distance) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    row.scrollBy({ left: distance, behavior: reducedMotion ? 'instant' : 'smooth' });
  };
  const select = (value: string) => onFiltersChange({ ...filters, dietary_services: [value] });

  return (
    <div ref={rowRef} className="flex max-w-full gap-2 overflow-x-auto overscroll-x-contain scroll-px-1 px-1 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:px-4" aria-label="Food options">
      {featuredOptions.map(({ value, label, Icon }) => {
        const active = selected === value;
        return (
          <Button key={value} aria-pressed={active} onPress={event => { select(value); revealPill(event.target); }}
            className={`h-11 shrink-0 rounded-full border px-4 text-sm font-semibold ${active ? 'border-[#175d3e] bg-[#175d3e] text-white shadow-[0_2px_8px_rgba(25,50,32,0.22)]' : 'border-[#9dbdab] bg-[#fafbf7] text-[#175d3e] shadow-[0_2px_8px_rgba(25,50,32,0.18)]'}`}>
            <Icon size={16} aria-hidden="true" /> {label}
          </Button>
        );
      })}
    </div>
  );
}
