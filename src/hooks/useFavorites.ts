import { useState, useEffect } from 'react';

const FAVORITES_STORAGE_KEY = 'muso-favorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (savedFavorites) {
        const parsed = JSON.parse(savedFavorites);
        console.log('Loaded favorites from localStorage:', parsed);
        setFavorites(parsed);
      }
    } catch (error) {
      console.warn('Failed to load favorites from localStorage:', error);
    }
  }, []);

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    if (favorites.length === 0 && !localStorage.getItem(FAVORITES_STORAGE_KEY)) {
      // Don't save empty array on initial load
      return;
    }
    try {
      console.log('Saving favorites to localStorage:', favorites);
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.warn('Failed to save favorites to localStorage:', error);
    }
  }, [favorites]);

  const isFavorite = (centerId: string): boolean => {
    const result = favorites.includes(centerId);
    console.log(`Checking if ${centerId} is favorite:`, result, 'Current favorites:', favorites);
    return result;
  };

  const addFavorite = (centerId: string) => {
    console.log('Adding favorite:', centerId);
    setFavorites(prev => {
      if (!prev.includes(centerId)) {
        const newFavorites = [...prev, centerId];
        console.log('New favorites after add:', newFavorites);
        return newFavorites;
      }
      return prev;
    });
  };

  const removeFavorite = (centerId: string) => {
    console.log('Removing favorite:', centerId);
    setFavorites(prev => prev.filter(id => id !== centerId));
  };

  const toggleFavorite = (centerId: string) => {
    console.log('Toggling favorite for:', centerId);
    if (isFavorite(centerId)) {
      removeFavorite(centerId);
    } else {
      addFavorite(centerId);
    }
  };

  const clearAllFavorites = () => {
    setFavorites([]);
  };

  return {
    favorites,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    clearAllFavorites,
    favoritesCount: favorites.length
  };
};