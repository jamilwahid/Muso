import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface FavoritesContextType {
  favorites: string[];
  isFavorite: (centerId: string) => boolean;
  addFavorite: (centerId: string) => void;
  removeFavorite: (centerId: string) => void;
  toggleFavorite: (centerId: string) => void;
  clearAllFavorites: () => void;
  favoritesCount: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const FAVORITES_STORAGE_KEY = 'muso-favorites';

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
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
    console.log('Current favorites before toggle:', favorites);
    if (isFavorite(centerId)) {
      removeFavorite(centerId);
    } else {
      addFavorite(centerId);
    }
  };

  const clearAllFavorites = () => {
    setFavorites([]);
  };

  const value: FavoritesContextType = {
    favorites,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    clearAllFavorites,
    favoritesCount: favorites.length
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};