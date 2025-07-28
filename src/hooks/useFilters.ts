import { useMemo } from 'react';
import { Center, Filters } from '../types/center';
import { useFavorites } from '../contexts/FavoritesContext';

export const useFilters = (centers: Center[], filters: Filters) => {
  const { favorites } = useFavorites();

  const filteredCenters = useMemo(() => {
    let filtered = centers.filter(center => {
      // Only show centers that have infant programs
      const hasInfantProgram = center.programs.some(p => 
        p.age_group.toLowerCase().includes('infant')
      );
      if (!hasInfantProgram) {
        return false;
      }

      // CWELCC filter - only filter when explicitly set to true
      if (filters.CWELCC_participant === true && !center.CWELCC_participant) {
        return false;
      }

      // Subsidy filter - only filter when explicitly set to true
      if (filters.subsidy_available === true && !center.subsidy_available) {
        return false;
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

    // Apply favorites filter if enabled
    if (filters.showFavoritesOnly) {
      filtered = filtered.filter(center => favorites.includes(center.center_id));
    }

    return filtered;
  }, [centers, filters, favorites]);

  const availableOptions = useMemo(() => {
    const languages = [...new Set(centers.flatMap(c => c.languages_spoken))].sort();
    const dietaryServices = [...new Set(centers.flatMap(c => c.dietary_services))].sort();

    return { languages, dietaryServices };
  }, [centers]);

  return { filteredCenters, availableOptions };
};