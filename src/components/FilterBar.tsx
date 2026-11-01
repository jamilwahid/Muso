import React from 'react';
import { Check, ChevronDown, Search, SlidersHorizontal, Users } from 'lucide-react';
import { Filters } from '../types/center';

interface FilterBarProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  availableOptions: {
    ageGroups: string[];
    dietaryServices: string[];
  };
}

const featuredOptions = [
  { value: 'Halal Food Option Available', label: 'Halal Food Option Available', halal: true },
  { value: 'Halal Centre', label: 'Halal Centre', halal: true },
  { value: 'Vegetarian Food Option Available', label: 'Vegetarian', halal: false },
  { value: 'Pork-Free Menu', label: 'Pork-Free', halal: false }
];

const foodSetupTags = ['Catered Food', 'Food Prepared on Premises'];

export const FilterBar: React.FC<FilterBarProps> = ({ filters, onFiltersChange, availableOptions }) => {
  const toggleFoodOption = (value: string) => {
    const selected = filters.dietary_services;
    onFiltersChange({
      ...filters,
      dietary_services: selected.includes(value)
        ? selected.filter(item => item !== value)
        : [...selected, value]
    });
  };

  const toggleAge = (age: string) => {
    const selected = filters.age_groups;
    onFiltersChange({
      ...filters,
      age_groups: selected.includes(age) ? selected.filter(item => item !== age) : [...selected, age]
    });
  };

  const toggleBoolean = (key: 'CWELCC_participant' | 'subsidy_available') => {
    onFiltersChange({ ...filters, [key]: filters[key] === true ? null : true });
  };

  const secondaryFoodOptions = availableOptions.dietaryServices.filter(
    option => !featuredOptions.some(featured => featured.value === option)
  );
  const foodSetup = secondaryFoodOptions.filter(option => foodSetupTags.includes(option));
  const otherDietaryOptions = secondaryFoodOptions.filter(option => !foodSetupTags.includes(option));
  const selectedSecondaryCount =
    secondaryFoodOptions.filter(option => filters.dietary_services.includes(option)).length +
    filters.age_groups.length +
    (filters.CWELCC_participant === true ? 1 : 0) +
    (filters.subsidy_available === true ? 1 : 0);

  const buttonBase = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#176044]/30';

  const checkboxOption = (option: string) => (
    <label key={option} className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#48544b] hover:bg-[#f1f5ef]">
      <input
        type="checkbox"
        checked={filters.dietary_services.includes(option)}
        onChange={() => toggleFoodOption(option)}
        className="h-4 w-4 rounded border-[#c6cec5] accent-[#176044]"
      />
      <span>{option}</span>
    </label>
  );

  return (
    <div className="flex flex-wrap items-center gap-2">
      {featuredOptions.map(option => {
        const active = filters.dietary_services.includes(option.value);
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => toggleFoodOption(option.value)}
            className={`${buttonBase} ${active
              ? option.halal
                ? 'border-[#176044] bg-[#176044] text-white shadow-[0_2px_5px_rgba(18,75,54,0.16)]'
                : 'border-[#a8c9ad] bg-[#eaf4e9] text-[#20573d]'
              : 'border-[#dedacf] bg-[#fffdf9] text-[#48544b] hover:border-[#bacdbd] hover:bg-[#f5f8f2]'
            }`}
          >
            {active && <Check className="h-4 w-4 shrink-0" />}
            {option.label}
          </button>
        );
      })}

      <label className="relative min-w-[220px] flex-1 sm:max-w-[360px]">
        <span className="sr-only">Search by neighbourhood or postal code</span>
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#89948b]" />
        <input
          type="search"
          value={filters.location_query}
          onChange={event => onFiltersChange({ ...filters, location_query: event.target.value })}
          placeholder="Neighbourhood or postal code"
          className="h-11 w-full rounded-xl border border-[#dedacf] bg-[#fffdf9] pl-9 pr-3 text-sm text-[#303c33] outline-none transition placeholder:text-[#8a9289] focus:border-[#176044] focus:ring-4 focus:ring-[#176044]/10"
        />
      </label>

      <details className="relative">
        <summary className={`${buttonBase} list-none border-[#dedacf] bg-[#fffdf9] text-[#48544b] hover:border-[#bacdbd] hover:bg-[#f5f8f2] [&::-webkit-details-marker]:hidden`}>
          <SlidersHorizontal className="h-4 w-4" />
          More filters{selectedSecondaryCount > 0 ? ` · ${selectedSecondaryCount}` : ''}
          <ChevronDown className="h-4 w-4" />
        </summary>
        <div className="absolute right-0 z-40 mt-2 max-h-[70vh] w-[min(90vw,390px)] overflow-y-auto rounded-2xl border border-[#dedacf] bg-[#fffdf9] p-3 shadow-[0_12px_28px_rgba(32,43,36,0.16)]">
          {secondaryFoodOptions.length > 0 && (
            <section aria-label="More food options" className="pb-3">
              <h3 className="px-3 pb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#a75b3e]">More food options</h3>
              <p className="px-3 pb-1 text-xs leading-relaxed text-[#737d73]">Results include centres listing any selected food option.</p>
              {otherDietaryOptions.map(checkboxOption)}
            </section>
          )}

          {foodSetup.length > 0 && (
            <section aria-label="Food setup" className="border-t border-[#e8e3d9] py-3">
              <h3 className="px-3 pb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#737d73]">Food setup</h3>
              {foodSetup.map(checkboxOption)}
            </section>
          )}

          <section aria-label="Child age" className="border-t border-[#e8e3d9] py-3">
            <h3 className="px-3 pb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#737d73]">Child age</h3>
            {availableOptions.ageGroups.map(age => (
              <label key={age} className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#48544b] hover:bg-[#f1f5ef]">
                <input
                  type="checkbox"
                  checked={filters.age_groups.includes(age)}
                  onChange={() => toggleAge(age)}
                  className="h-4 w-4 rounded border-[#c6cec5] accent-[#176044]"
                />
                {age}
              </label>
            ))}
          </section>

          <section aria-label="Cost and program filters" className="border-t border-[#e8e3d9] py-3">
            <h3 className="px-3 pb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#737d73]">Cost and programs</h3>
            <label className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#48544b] hover:bg-[#f1f5ef]">
              <input
                type="checkbox"
                checked={filters.CWELCC_participant === true}
                onChange={() => toggleBoolean('CWELCC_participant')}
                className="h-4 w-4 rounded border-[#c6cec5] accent-[#176044]"
              />
              CWELCC
            </label>
            <label className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#48544b] hover:bg-[#f1f5ef]">
              <input
                type="checkbox"
                checked={filters.subsidy_available === true}
                onChange={() => toggleBoolean('subsidy_available')}
                className="h-4 w-4 rounded border-[#c6cec5] accent-[#176044]"
              />
              Fee subsidy
            </label>
          </section>
        </div>
      </details>
    </div>
  );
};