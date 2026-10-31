import { useMemo } from 'react';
import { Center, Filters } from '../types/center';

const hasHalalListing = (center: Center) =>
  center.dietary_services.some(service => /halal/i.test(service));

const normalize = (value: string) =>
  value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase().trim();

export const useFilters = (centers: Center[], filters: Filters) => {
  const filteredCenters = useMemo(() => {
    const locationQuery = normalize(filters.location_query);
    return centers.filter(center => {
      if (filters.halal_listed && !hasHalalListing(center)) return false;
      if (filters.CWELCC_participant === true && !center.CWELCC_participant) return false;
      if (filters.subsidy_available === true && !center.subsidy_available) return false;

      if (filters.age_groups.length > 0) {
        const centerAgeGroups = center.programs.map(program => program.age_group);
        if (!filters.age_groups.some(age => centerAgeGroups.includes(age))) return false;
      }

      if (locationQuery) {
        const locationText = normalize([
          center.center_name,
          center.location.address,
          center.location.ward,
          center.location.postal_code || ''
        ].join(' '));
        if (!locationText.includes(locationQuery)) return false;
      }

      return true;
    });
  }, [centers, filters]);

  const availableOptions = useMemo(() => {
    const ageGroups = [...new Set(centers.flatMap(center => center.programs.map(program => program.age_group)))].sort();
    return { ageGroups };
  }, [centers]);

  return { filteredCenters, availableOptions };
};