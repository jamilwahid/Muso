import React from 'react';
import { Check, ChevronDown, MapPin, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Filters } from '../types/center';

interface FilterBarProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  availableOptions: {
    ageGroups: string[];
    postalCodes: string[];
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

  const toggleValue = (key: 'age_groups' | 'postal_codes', value: string) => {
    const values = filters[key];
    onFiltersChange({
      ...filters,
      [key]: values.includes(value) ? values.filter(item => item !== value) : [...values, value]
    });
  };

  const buttonClass = (active: boolean, primary = false) =>
    `inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
      active
        ? primary
          ? 'border-emerald-700 bg-emerald-800 text-white'
          : 'border-slate-300 bg-slate-100 text-slate-900'
        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
    }`;

  const dropdown = (key: 'age_groups' | 'postal_codes', label: string, options: string[], Icon: LucideIcon) => {
    const selected = filters[key];
    return (
      <details className="relative">
        <summary className={buttonClass(selected.length > 0)}>
          <Icon className="h-4 w-4" />
          <span>{label}{selected.length ? ` · ${selected.length}` : ''}</span>
          <ChevronDown className="h-4 w-4" />
        </summary>
        <div className="absolute left-0 z-20 mt-2 max-h-64 w-64 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
          {options.map(option => (
            <label key={option} className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => toggleValue(key, option)}
                className="h-4 w-4 rounded border-slate-300 accent-emerald-700"
              />
              {option}
            </label>
          ))}
          {options.length === 0 && <p className="px-3 py-2 text-sm text-slate-500">No options available.</p>}
        </div>
      </details>
    );
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        aria-pressed={filters.halal_listed}
        onClick={() => toggle('halal_listed')}
        className={buttonClass(filters.halal_listed, true)}
      >
        <span className={`flex h-5 w-5 items-center justify-center rounded-md border ${
          filters.halal_listed ? 'border-white bg-white text-emerald-800' : 'border-white/70'
        }`}>
          {filters.halal_listed && <Check className="h-4 w-4" />}
        </span>
        <span>Halal tag in City listing</span>
      </button>

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

      {dropdown('age_groups', 'Child age', availableOptions.ageGroups, Users)}
      {dropdown('postal_codes', 'Area', availableOptions.postalCodes, MapPin)}
    </div>
  );
};