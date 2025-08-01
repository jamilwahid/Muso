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
    <div className="w-16 bg-white border-r border-slate-200 flex flex-col shadow-sm">
      {/* Top Section - Logo */}
      <div className="flex flex-col items-center pt-4 pb-3">
        <div className="relative group cursor-pointer">
          {/* Muso Logo - Larger size for hierarchy */}
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105">
            <Baby className="h-6 w-6 text-white" />
            
            {/* Subtle glow effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 rounded-2xl opacity-0 group-hover:opacity-20 blur-lg transition-opacity duration-300"></div>
          </div>
        </div>
      </div>

      {/* Horizontal Separator */}
      <div className="mx-3 mb-4">
        <div className="h-px bg-slate-200"></div>
      </div>

      {/* Middle Section - Navigation */}
      <nav className="flex-1 flex flex-col items-center space-y-1 px-2">
        {/* Explore/Map Button */}
        <button
          onClick={() => setCurrentView('map')}
          className={`relative group w-12 h-12 rounded-xl transition-all duration-200 flex items-center justify-center ${
            currentView === 'map'
              ? 'bg-slate-100 text-slate-700 shadow-sm'
              : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
          }`}
          title="Explore Centers"
        >
          {/* Navigation icon - Smaller than logo */}
          <Map className="h-5 w-5 transition-colors duration-200" />
          
          {/* Active indicator - Left border */}
          {currentView === 'map' && (
            <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 rounded-r-full"></div>
          )}
          
          {/* Hover tooltip background */}
          <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
            Explore Centers
          </div>
        </button>

        {/* Favorites/Shortlist Button - Positioned slightly lower */}
        <div className="pt-1">
          <button
            onClick={() => setCurrentView('shortlist')}
            className={`relative group w-12 h-12 rounded-xl transition-all duration-200 flex items-center justify-center ${
              currentView === 'shortlist'
                ? 'bg-slate-100 text-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
            }`}
            title="My Favorites"
          >
            {/* Navigation icon - Smaller than logo */}
            <Heart className={`h-5 w-5 transition-colors duration-200 ${
              currentView === 'shortlist' ? 'fill-current' : ''
            }`} />
            
            {/* Active indicator - Left border */}
            {currentView === 'shortlist' && (
              <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 rounded-r-full"></div>
            )}
            
            {/* Favorites Count Badge */}
            
            {/* Hover tooltip background */}
            <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
              My Shortlist
            </div>
          </button>
        </div>
      </nav>

      {/* Bottom Section - Spacer */}
      <div className="pb-4">
        {/* Future: Could add user avatar, settings, or help button here */}
      </div>
    </div>
  );
};