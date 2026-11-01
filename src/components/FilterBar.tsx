import React, { useState } from 'react';
import { Check, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { Filters } from '../types/center';

interface FilterBarProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  availableOptions: {
    dietaryServices: string[];
  };
}

const featuredOptions = [
  { value: 'Halal Food Option Available', label: 'Halal Food Option Available' },
  { value: 'Halal Centre', label: 'Halal Centre' },
  { value: 'Vegetarian Food Option Available', label: 'Vegetarian' },
  { value: 'Pork-Free Menu', label: 'Pork-Free' }
];

const additionalOptions = [
  { value: 'Vegan Food Option Available', label: 'Vegan Food Option Available' },
  { value: 'Kosher Food Option Available', label: 'Kosher Food Option Available' },
  { value: 'Kosher Centre', label: 'Kosher Centre' }
];

export const FilterBar: React.FC<FilterBarProps> = ({ filters, onFiltersChange, availableOptions }) => {
  const [moreOpen, setMoreOpen] = useState(false);
  const availableMoreOptions = additionalOptions.filter(option =>
    availableOptions.dietaryServices.includes(option.value)
  );
  const selectedMoreCount = availableMoreOptions.filter(option =>
    filters.dietary_services.includes(option.value)
  ).length;

  const toggleOption = (value: string) => {
    const selected = filters.dietary_services;
    onFiltersChange({
      ...filters,
      dietary_services: selected.includes(value)
        ? selected.filter(item => item !== value)
        : [...selected, value]
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-center">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {featuredOptions.map(option => {
            const active = filters.dietary_services.includes(option.value);
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={active}
                onClick={() => toggleOption(option.value)}
                className={`group flex items-center space-x-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 shadow-sm ring-1 ring-indigo-100'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {active && <Check className="h-4 w-4" />}
                <span>{option.label}</span>
              </button>
            );
          })}

          {availableMoreOptions.length > 0 && (
            <div className="relative">
              <button
                type="button"
                aria-expanded={moreOpen}
                onClick={() => setMoreOpen(open => !open)}
                className={`flex items-center space-x-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                  selectedMoreCount > 0
                    ? 'border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 shadow-sm ring-1 ring-indigo-100'
                    : 'border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 shadow-sm ring-1 ring-amber-100 hover:from-amber-100 hover:to-orange-100'
                }`}
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>More filters{selectedMoreCount > 0 ? ` · ${selectedMoreCount}` : ''}</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${moreOpen ? 'rotate-180' : ''}`} />
              </button>

              {moreOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-72 rounded-2xl border border-slate-200/60 bg-white/95 p-2 shadow-xl backdrop-blur-xl">
                  <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    More food options
                  </div>
                  {availableMoreOptions.map(option => {
                    const active = filters.dietary_services.includes(option.value);
                    return (
                      <label
                        key={option.value}
                        className="group flex cursor-pointer items-center space-x-3 rounded-xl p-3 transition-colors duration-150 hover:bg-slate-50"
                      >
                        <input
                          type="checkbox"
                          checked={active}
                          onChange={() => toggleOption(option.value)}
                          className="h-4 w-4 accent-indigo-600"
                        />
                        <span className="text-sm font-medium text-slate-700">{option.label}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};