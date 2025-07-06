import { useMemo } from 'react';
import { Center, Filters } from '../types/center';

export const useFilters = (centers: Center[], filters: Filters) => {
  const filteredCenters = useMemo(() => {
    return centers.filter(center => {
      // CWELCC filter - only filter when explicitly set to true
      if (filters.CWELCC_participant === true && !center.CWELCC_participant) {
        return false;
      }

      // Subsidy filter - only filter when explicitly set to true
      if (filters.subsidy_available === true && !center.subsidy_available) {
        return false;
      }

      // Age groups filter
      if (filters.age_groups.length > 0) {
        const centerAgeGroups = center.programs.map(p => p.age_group);
        if (!filters.age_groups.some(age => centerAgeGroups.includes(age))) {
          return false;
        }
      }

      // Languages filter
      if (filters.languages_spoken.length > 0) {
        if (!filters.languages_spoken.some(lang => center.languages_spoken.includes(lang))) {
          return false;
        }
      }

      // Dietary services filter
      if (filters.dietary_services.length > 0) {
        if (!filters.dietary_services.some(service => center.dietary_services.includes(service))) {
          return false;
        }
      }


      return true;
    });
  }, [centers, filters]);

  const availableOptions = useMemo(() => {
    const languages = [...new Set(centers.flatMap(c => c.languages_spoken))].sort();
    const ageGroups = [...new Set(centers.flatMap(c => c.programs.map(p => p.age_group)))].sort();
    const dietaryServices = [...new Set(centers.flatMap(c => c.dietary_services))].sort();

    return { languages, ageGroups, dietaryServices };
  }, [centers]);

  return { filteredCenters, availableOptions };
};