import { useState, useEffect } from 'react';

const FAVORITES_STORAGE_KEY = 'muso-favorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } catch (error) {
      console.warn('Failed to load favorites from localStorage:', error);
    }
  }, []);

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.warn('Failed to save favorites to localStorage:', error);
    }
  }, [favorites]);

  const isFavorite = (centerId: string): boolean => {
    return favorites.includes(centerId);
  };

  const addFavorite = (centerId: string) => {
    setFavorites(prev => {
      if (!prev.includes(centerId)) {
        return [...prev, centerId];
      }
      return prev;
    });
  };

  const removeFavorite = (centerId: string) => {
    setFavorites(prev => prev.filter(id => id !== centerId));
  };

  const toggleFavorite = (centerId: string) => {
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