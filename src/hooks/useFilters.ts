import { useMemo } from 'react';
import { Center, Filters } from '../types/center';

export const useFilters = (centers: Center[], filters: Filters) => {
  const filteredCenters = useMemo(() => {
    if (filters.dietary_services.length === 0) return centers;
    return centers.filter(center =>
      filters.dietary_services.some(option => center.dietary_services.includes(option))
    );
  }, [centers, filters]);

  const availableOptions = useMemo(() => {
    const dietaryServices = [...new Set(centers.flatMap(center => center.dietary_services))].sort();
    return { dietaryServices };
  }, [centers]);

  return { filteredCenters, availableOptions };
};
