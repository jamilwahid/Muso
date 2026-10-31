import { useMemo } from 'react';
import { Center, Filters } from '../types/center';

const hasHalalListing = (center: Center) =>
  center.dietary_services.some(service => /halal/i.test(service));

export const useFilters = (centers: Center[], filters: Filters) => {
  const filteredCenters = useMemo(() => {
    return centers.filter(center => {
      if (filters.halal_listed && !hasHalalListing(center)) return false;
      if (filters.CWELCC_participant === true && !center.CWELCC_participant) return false;
      if (filters.subsidy_available === true && !center.subsidy_available) return false;

      if (filters.age_groups.length > 0) {
        const centerAgeGroups = center.programs.map(program => program.age_group);
        if (!filters.age_groups.some(age => centerAgeGroups.includes(age))) return false;
      }

      if (filters.postal_codes.length > 0) {
        const postalCode = center.location.postal_code;
        if (!postalCode || !filters.postal_codes.some(code => postalCode.startsWith(code))) return false;
      }

      return true;
    });
  }, [centers, filters]);

  const availableOptions = useMemo(() => {
    const ageGroups = [...new Set(centers.flatMap(center => center.programs.map(program => program.age_group)))].sort();
    const postalCodes = [...new Set(
      centers.map(center => center.location.postal_code).filter(Boolean) as string[]
    )]
      .map(code => code.substring(0, 3))
      .filter((code, index, values) => values.indexOf(code) === index)
      .sort();

    return { ageGroups, postalCodes };
  }, [centers]);

  return { filteredCenters, availableOptions };
};