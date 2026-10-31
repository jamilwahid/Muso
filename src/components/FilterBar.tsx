import React from 'react';
import { Check, ChevronDown, Search, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Filters } from '../types/center';

interface FilterBarProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  availableOptions: {
    ageGroups: string[];
  };
}

export const FilterBar: React.FC<FilterBarProps> = ({ filters, onFiltersChange, availableOptions }) => {
  const toggle = (key: 'halal_listed' | 'CWELCC_participant' | 'subsidy_available') => {
    if (key === 'halal_listed') {
      onFiltersChange({ ...filters, halal_listed: !filters.halal_listed });
      return;
    }
    onFiltersChange({ ...filters, [key]: filters[key] === true ? null : true });
  };

  const buttonClass = (active: boolean, primary = false) =>
    `inline-flex min-h-11 items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-semibold transition-all duration-150 ${
      active
        ? primary
          ? 'border-[#176044] bg-[#176044] text-white shadow-[0_2px_5px_rgba(18,75,54,0.16)]'
          : 'border-[#cfdccf] bg-[#edf5ed] text-[#214d39]'
        : 'border-[#dedacf] bg-[#fffdf9] text-[#48544b] hover:border-[#bacdbd] hover:bg-[#f5f8f2]'
    }`;

  const toggleAge = (age: string) => {
    const selected = filters.age_groups;
    onFiltersChange({
      ...filters,
      age_groups: selected.includes(age) ? selected.filter(item => item !== age) : [...selected, age]
    });
  };

  const ageDropdown = (Icon: LucideIcon) => (
    <details className="relative">
      <summary className={buttonClass(filters.age_groups.length > 0)}>
        <Icon className="h-4 w-4" />
        <span>Child age{filters.age_groups.length ? ` · ${filters.age_groups.length}` : ''}</span>
        <ChevronDown className="h-4 w-4" />
      </summary>
      <div className="absolute left-0 z-30 mt-2 max-h-64 w-64 overflow-y-auto rounded-2xl border border-[#dedacf] bg-[#fffdf9] p-2 shadow-[0_12px_28px_rgba(32,43,36,0.12)]">
        {availableOptions.ageGroups.map(age => (
          <label key={age} className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-[#48544b] hover:bg-[#f1f5ef]">
            <input
              type="checkbox"
              checked={filters.age_groups.includes(age)}
              onChange={() => toggleAge(age)}
              className="h-4 w-4 rounded border-[#c6cec5] accent-[#176044]"
            />
            {age}
          </label>
        ))}
      </div>
    </details>
  );

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        aria-pressed={filters.halal_listed}
        onClick={() => toggle('halal_listed')}
        className={buttonClass(filters.halal_listed, true)}
      >
        <span className={`flex h-5 w-5 items-center justify-center rounded border ${
          filters.halal_listed ? 'border-white bg-white text-[#176044]' : 'border-white/70'
        }`}>
          {filters.halal_listed && <Check className="h-4 w-4" />}
        </span>
        Halal in City listing
      </button>

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

      {ageDropdown(Users)}

      <button
        type="button"
        aria-pressed={filters.CWELCC_participant === true}
        onClick={() => toggle('CWELCC_participant')}
        className={buttonClass(filters.CWELCC_participant === true)}
      >
        CWELCC
      </button>

      <button
        type="button"
        aria-pressed={filters.subsidy_available === true}
        onClick={() => toggle('subsidy_available')}
        className={buttonClass(filters.subsidy_available === true)}
      >
        Fee subsidy
      </button>
    </div>
  );
};