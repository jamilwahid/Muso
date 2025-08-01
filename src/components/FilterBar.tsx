import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, DollarSign, Users, Languages, Utensils, X, Search, Landmark, Sparkles, Heart } from 'lucide-react';
import { Filters } from '../types/center';
import { useFavorites } from '../contexts/FavoritesContext';

interface FilterBarProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  availableOptions: {
    languages: string[];
    dietaryServices: string[];
  };
}

export const FilterBar: React.FC<FilterBarProps> = ({ filters, onFiltersChange, availableOptions }) => {
  const { favoritesCount } = useFavorites();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [searchTerms, setSearchTerms] = useState<{ [key: string]: string }>({});
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown && dropdownRefs.current[openDropdown] && 
          !dropdownRefs.current[openDropdown]?.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown]);

  const handleBinaryToggle = (key: 'CWELCC_participant' | 'subsidy_available') => {
    // Simple toggle: null (off) -> true (on) -> null (off)
    onFiltersChange({
      ...filters,
      [key]: filters[key] === true ? null : true
    });
  };

  const handleMultiSelectFilter = (key: keyof Filters, value: string) => {
    const currentValues = filters[key] as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    onFiltersChange({
      ...filters,
      [key]: newValues
    });
  };

  const clearMultiSelectFilter = (key: keyof Filters) => {
    onFiltersChange({
      ...filters,
      [key]: []
    });
    // Clear search term when clearing filter
    setSearchTerms(prev => ({ ...prev, [key]: '' }));
  };

  const handleSearchChange = (key: string, searchTerm: string) => {
    setSearchTerms(prev => ({ ...prev, [key]: searchTerm }));
  };

  const getFilteredOptions = (key: string, options: string[]) => {
    const searchTerm = searchTerms[key] || '';
    if (!searchTerm) return options;
    
    return options.filter(option => 
      option.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const getFilterButtonContent = (label: string, values: string[], count: number, isUnique = false) => {
    if (count === 0) {
      return (
        <div className="flex items-center space-x-2">
          <span>{label}</span>
          {isUnique && (
            <div className="flex items-center space-x-1">
              <Sparkles className="h-3 w-3 text-amber-500" />
            </div>
          )}
        </div>
      );
    }
    
    return (
      <div className="flex items-center space-x-2">
        <span>{label}</span>
        <div className="bg-white/90 text-indigo-600 px-2 py-0.5 rounded-full text-xs font-bold shadow-sm">
          {count}
        </div>
        {isUnique && (
          <Sparkles className="h-3 w-3 text-amber-500" />
        )}
      </div>
    );
  };

  const getDropdownHeader = (key: string) => {
    switch (key) {
      case 'languages_spoken':
        return (
          <div className="flex items-center space-x-2">
            <span>Languages spoken by staff</span>
          </div>
        );
      case 'dietary_services':
        return (
          <div className="flex items-center space-x-2">
            <span>Dietary services</span>
          </div>
        );
      default:
        return `Select ${key}`;
    }
  };

  return (
    <div className="max-w-7xl mx-auto relative z-[100]">
      <div className="flex items-center justify-center">
        <div className="flex items-center space-x-3 flex-wrap gap-y-3">
          {/* Binary Toggle Filters - Now using Trophy for CWELCC */}
          <button
            onClick={() => handleBinaryToggle('CWELCC_participant')}
            className={`group relative px-4 py-2.5 border rounded-xl text-sm font-medium transition-all duration-200 ${
              filters.CWELCC_participant === true
                ? 'border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 shadow-sm ring-1 ring-indigo-100'
                : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              {filters.CWELCC_participant === true ? (
                <Check className="h-4 w-4" />
              ) : (
                <Landmark className="h-4 w-4" />
              )}
              <span>CWELCC</span>
            </div>
          </button>

          <button
            onClick={() => handleBinaryToggle('subsidy_available')}
            className={`group relative px-4 py-2.5 border rounded-xl text-sm font-medium transition-all duration-200 ${
              filters.subsidy_available === true
                ? 'border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 shadow-sm ring-1 ring-indigo-100'
                : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              {filters.subsidy_available === true ? (
                <Check className="h-4 w-4" />
              ) : (
                <DollarSign className="h-4 w-4" />
              )}
              <span>Subsidy</span>
            </div>
          </button>

          {/* Multi-select Dropdown Filters with Icons - Reordered */}
          {[
            { 
              key: 'languages_spoken', 
              label: 'Languages', 
              icon: Languages,
              options: availableOptions.languages,
              isUnique: true
            },
            { 
              key: 'dietary_services', 
              label: 'Dietary', 
              icon: Utensils,
              options: availableOptions.dietaryServices,
              isUnique: true
            }
          ].map(({ key, label, icon: Icon, options, isUnique }) => {
            const selectedCount = (filters[key as keyof Filters] as string[]).length;
            
            return (
              <div key={key} className="relative z-[101]" ref={el => dropdownRefs.current[key] = el}>
                <button
                  onClick={() => setOpenDropdown(openDropdown === key ? null : key)}
                  className={`group flex items-center space-x-2 px-4 py-2.5 border rounded-xl text-sm font-medium transition-all duration-200 relative ${
                    selectedCount > 0
                      ? 'border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 shadow-sm ring-1 ring-indigo-100'
                      : isUnique
                      ? 'border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 hover:from-amber-100 hover:to-orange-100 shadow-sm ring-1 ring-amber-100'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {getFilterButtonContent(label, filters[key as keyof Filters] as string[], selectedCount, isUnique)}
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 flex-shrink-0 ${openDropdown === key ? 'rotate-180' : ''}`} />
                  
                  {/* Sparkle animation for unique filters */}
                  {isUnique && selectedCount === 0 && (
                    <div className="absolute -top-1 -right-1 animate-pulse">
                    </div>
                  )}
                </button>

                {openDropdown === key && (
                  <div className="absolute top-full left-0 mt-2 w-72 bg-white/95 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-xl z-[102] max-h-80 overflow-hidden">
                    <div className="p-2 max-h-80 overflow-y-auto">
                      {/* Search Input */}
                      <div className="px-3 py-2 border-b border-slate-100 mb-2">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                          <input
                            type="text"
                            placeholder={`Search ${label.toLowerCase()}...`}
                            value={searchTerms[key] || ''}
                            onChange={(e) => handleSearchChange(key, e.target.value)}
                            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100 mb-2 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Icon className="h-3.5 w-3.5" />
                          {getDropdownHeader(key)}
                        </div>
                        {selectedCount > 0 && (
                          <button
                            onClick={() => clearMultiSelectFilter(key as keyof Filters)}
                            className="flex items-center space-x-1 text-slate-400 hover:text-red-500 transition-colors duration-200 text-xs font-medium"
                          >
                            <X className="h-3 w-3" />
                            <span>Clear all</span>
                          </button>
                        )}
                      </div>

                      {/* Exclusive feature callout for unique filters */}
                      {isUnique && (
                        <div className="px-3 pb-3 mb-2 border-b border-amber-100 bg-gradient-to-r from-amber-50/50 to-orange-50/50 rounded-xl mx-2">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="bg-gradient-to-r from-amber-400 to-orange-500 p-1 rounded-lg">
                              <Sparkles className="h-3 w-3 text-white" />
                            </div>
                            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Muso Exclusive</span>
                          </div>
                          <p className="text-xs text-amber-600 leading-relaxed">
                            {key === 'languages_spoken' 
                              ? "Find centers with staff who speak your family's language!"
                              : "Discover centers offering specific dietary accommodation!"
                            }
                          </p>
                        </div>
                      )}


                      {getFilteredOptions(key, options).map(option => (
                        <label key={option} className="flex items-center space-x-3 p-3 hover:bg-slate-50 cursor-pointer rounded-xl transition-colors duration-150 group">
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={(filters[key as keyof Filters] as string[]).includes(option)}
                              onChange={() => handleMultiSelectFilter(key as keyof Filters, option)}
                              className="sr-only"
                            />
                            <div className={`w-5 h-5 rounded-lg border-2 transition-all duration-200 ${
                              (filters[key as keyof Filters] as string[]).includes(option)
                                ? isUnique 
                                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 border-amber-500'
                                  : 'bg-indigo-500 border-indigo-500'
                                : 'border-slate-300 group-hover:border-slate-400'
                            }`}>
                              {(filters[key as keyof Filters] as string[]).includes(option) && (
                                <Check className="h-3 w-3 text-white absolute top-0.5 left-0.5" />
                              )}
                            </div>
                          </div>
                          <span className="text-sm text-slate-700 font-medium flex items-center space-x-2">
                            <span>{option}</span>
                            {isUnique && (
                              <Sparkles className="h-3 w-3 text-amber-500" />
                            )}
                          </span>
                        </label>
                      ))}

                      {/* No results message */}
                      {getFilteredOptions(key, options).length === 0 && searchTerms[key] && (
                        <div className="px-3 py-8 text-center">
                          <div className="text-slate-400 mb-2">
                            <Search className="h-6 w-6 mx-auto" />
                          </div>
                          <div className="text-sm text-slate-500">No results found</div>
                          <div className="text-xs text-slate-400 mt-1">Try a different search term</div>
                        </div>
                      )}

                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};