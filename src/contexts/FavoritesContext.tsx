import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

import { FavoriteCenterData, FavoriteActions, KanbanStatus } from '../types/center';

interface FavoritesContextType {
  favorites: FavoriteCenterData[];
  isFavorite: (centerId: string) => boolean;
  addFavorite: (centerId: string) => void;
  removeFavorite: (centerId: string) => void;
  toggleFavorite: (centerId: string) => void;
  toggleAction: (centerId: string, actionKey: keyof FavoriteActions) => void;
  updateNotes: (centerId: string, newNotes: string) => void;
  updateKanbanStatus: (centerId: string, newStatus: KanbanStatus) => void;
  updateKanbanStatus: (centerId: string, newStatus: KanbanStatus) => void;
  clearAllFavorites: () => void;
  favoritesCount: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const FAVORITES_STORAGE_KEY = 'muso-favorites';

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [favorites, setFavorites] = useState<FavoriteCenterData[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (savedFavorites) {
        const parsed = JSON.parse(savedFavorites);
        // Handle migration from old string[] format to new FavoriteCenterData[] format
        if (Array.isArray(parsed) && parsed.length > 0) {
          if (typeof parsed[0] === 'string') {
            // Migrate old format
            const migrated: FavoriteCenterData[] = parsed.map((centerId: string) => ({
              center_id: centerId,
              actions: { called: false, applied: false, visited: false },
              notes: '',
              lastUpdated: new Date().toISOString(),
              kanbanStatus: 'interested' as KanbanStatus
            }));
            console.log('Migrated favorites from old format:', migrated);
            setFavorites(migrated);
            localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(migrated));
          } else {
            // New format - check if we need to add kanbanStatus to existing entries
            console.log('Loaded favorites from localStorage:', parsed);
            const migratedWithKanban = parsed.map((fav: any) => ({
              ...fav,
              kanbanStatus: fav.kanbanStatus || 'interested'
            }));
            setFavorites(migratedWithKanban);
          }
        }
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
    const result = favorites.some(fav => fav.center_id === centerId);
    return result;
  };

  const addFavorite = (centerId: string) => {
    console.log('Adding favorite:', centerId);
    setFavorites(prev => {
      if (!prev.some(fav => fav.center_id === centerId)) {
        const newFavorite: FavoriteCenterData = {
          center_id: centerId,
          actions: { called: false, applied: false, visited: false },
          notes: '',
          lastUpdated: new Date().toISOString(),
          kanbanStatus: 'interested'
        };
        const newFavorites = [...prev, newFavorite];
        console.log('New favorites after add:', newFavorites);
        return newFavorites;
      }
      return prev;
    });
  };

  const removeFavorite = (centerId: string) => {
    console.log('Removing favorite:', centerId);
    setFavorites(prev => prev.filter(fav => fav.center_id !== centerId));
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

  const toggleAction = (centerId: string, actionKey: keyof FavoriteActions) => {
    console.log('Toggling action:', actionKey, 'for center:', centerId);
    setFavorites(prev => prev.map(fav => {
      if (fav.center_id === centerId) {
        return {
          ...fav,
          actions: {
            ...fav.actions,
            [actionKey]: !fav.actions[actionKey]
          },
          lastUpdated: new Date().toISOString()
        };
      }
      return fav;
    }));
  };

  const updateNotes = (centerId: string, newNotes: string) => {
    console.log('Updating notes for center:', centerId);
    setFavorites(prev => prev.map(fav => {
      if (fav.center_id === centerId) {
        return {
          ...fav,
          notes: newNotes,
          lastUpdated: new Date().toISOString()
        };
      }
      return fav;
    }));
  };

  const updateKanbanStatus = (centerId: string, newStatus: KanbanStatus) => {
    console.log('Updating kanban status for center:', centerId, 'to:', newStatus);
    setFavorites(prev => prev.map(fav => {
      if (fav.center_id === centerId) {
        return {
          ...fav,
          kanbanStatus: newStatus,
          lastUpdated: new Date().toISOString()
        };
      }
      return fav;
    }));
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
    toggleAction,
    updateNotes,
    updateKanbanStatus,
    updateKanbanStatus,
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