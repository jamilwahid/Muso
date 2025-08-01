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
    <div className="w-16 bg-slate-900 flex flex-col shadow-xl">
      {/* Top Section - Logo */}
      <div className="flex flex-col items-center pt-6 pb-8">
        <div className="relative group cursor-pointer">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <Baby className="h-5 w-5 text-white" />
          </div>
        </div>
      </div>

      {/* Middle Section - Navigation */}
      <nav className="flex-1 flex flex-col items-center space-y-2 px-2">
        {/* Explore Button */}
        <button
          onClick={() => setCurrentView('map')}
          className={`relative group w-12 h-12 rounded-xl transition-all duration-200 flex items-center justify-center ${
            currentView === 'map'
              ? 'bg-slate-800 text-indigo-400 shadow-lg'
              : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/50'
          }`}
          title="Explore Centers"
        >
          <Map className="h-5 w-5" />
          
          {/* Active indicator */}
          {currentView === 'map' && (
            <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-indigo-400 rounded-r-full"></div>
          )}
        </button>

        {/* Favorites Button */}
        <button
          onClick={() => setCurrentView('shortlist')}
          className={`relative group w-12 h-12 rounded-xl transition-all duration-200 flex items-center justify-center ${
            currentView === 'shortlist'
              ? 'bg-slate-800 text-pink-400 shadow-lg'
              : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/50'
          }`}
          title="My Favorites"
        >
          <Heart className={`h-5 w-5 ${
            currentView === 'shortlist' ? 'fill-current' : ''
          }`} />
          
          {/* Active indicator */}
          {currentView === 'shortlist' && (
            <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-pink-400 rounded-r-full"></div>
          )}
          
          {/* Badge */}
          {favoritesCount > 0 && (
            <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-lg border-2 border-slate-900">
              <span className="px-1">{favoritesCount > 99 ? '99+' : favoritesCount}</span>
            </div>
          )}
        </button>
      </nav>

      {/* Bottom Section - Spacer */}
      <div className="pb-6">
        {/* Future: Could add user avatar, settings, or help button here */}
      </div>
    </div>
  );
};