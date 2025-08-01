```tsx
import React from 'react';
import { Baby, Map, Heart } from 'lucide-react';
import { useFavorites } from '../contexts/FavoritesContext';

interface LeftSidebarProps {
  currentView: 'map' | 'shortlist';
  setCurrentView: (view: 'map' | 'shortlist') => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({ currentView, setCurrentView }) => {
  const { favoritesCount } = useFavorites();

  return (
    <div className="w-20 bg-white/95 backdrop-blur-xl border-r border-slate-200/60 flex flex-col items-center py-6 shadow-lg z-50">
      {/* Logo */}
      <div className="mb-10">
        <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-3 rounded-2xl shadow-lg">
          <Baby className="h-8 w-8 text-white" />
        </div>
      </div>

      {/* Navigation Buttons */}
      <nav className="flex flex-col space-y-4">
        <button
          onClick={() => setCurrentView('map')}
          className={\`p-3 rounded-xl transition-all duration-200 flex flex-col items-center group ${
            currentView === 'map'
              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
              : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
          }`}
          title="Explore Centers"
        >
          <Map className="h-6 w-6" />
          <span className="text-xs font-medium mt-1">Explore</span>
        </button>

        <button
          onClick={() => setCurrentView('shortlist')}
          className={\`p-3 rounded-xl transition-all duration-200 flex flex-col items-center relative group ${
            currentView === 'shortlist'
              ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg'
              : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
          }`}
          title="My Favorites"
        >
          <Heart className="h-6 w-6" />
          <span className="text-xs font-medium mt-1">Favorites</span>
          {favoritesCount > 0 && (
            <div className={\`absolute -top-1 -right-1 px-2 py-0.5 rounded-full text-xs font-bold shadow-sm ${
              currentView === 'shortlist'
                ? 'bg-white text-pink-600'
                : 'bg-pink-500 text-white'
            }`}>
              {favoritesCount}
            </div>
          )}
        </button>
      </nav>
    </div>
  );
};
```