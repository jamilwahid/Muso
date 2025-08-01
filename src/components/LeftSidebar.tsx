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
    <div className="w-16 bg-white/98 backdrop-blur-xl border-r border-slate-200/80 flex flex-col shadow-sm">
      {/* Top Section - Logo */}
      <div className="flex flex-col items-center pt-6 pb-8">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur-sm opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
          <div className="relative bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-2.5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <Baby className="h-7 w-7 text-white" />
          </div>
        </div>
      </div>

      {/* Middle Section - Navigation */}
      <nav className="flex-1 flex flex-col items-center space-y-3 px-2">
        {/* Explore Button */}
        <button
          onClick={() => setCurrentView('map')}
          className={`relative group w-12 h-12 rounded-xl transition-all duration-300 flex items-center justify-center ${
            currentView === 'map'
              ? 'border-2 border-indigo-400 bg-indigo-50/50 text-indigo-700 shadow-md scale-105'
              : 'bg-slate-50/80 text-slate-600 hover:bg-slate-100/80 hover:text-slate-800 hover:scale-105 hover:shadow-md'
          }`}
          title="Explore Centers"
        >
          {/* Subtle glow effect for active state */}
          {currentView === 'map' && (
            <div className="absolute inset-0 bg-indigo-400 rounded-xl blur-lg opacity-20 -z-10"></div>
          )}
          
          {/* Icon with gradient treatment for active state */}
          <Map className={`h-5 w-5 transition-all duration-300 ${
            currentView === 'map'
              ? 'text-indigo-600'
              : 'text-slate-600 group-hover:text-slate-800'
          }`} />
          
          {/* Subtle shimmer effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 rounded-xl"></div>
        </button>

        {/* Favorites Button */}
        <button
          onClick={() => setCurrentView('shortlist')}
          className={`relative group w-12 h-12 rounded-xl transition-all duration-300 flex items-center justify-center ${
            currentView === 'shortlist'
              ? 'border-2 border-pink-400 bg-pink-50/50 text-pink-700 shadow-md scale-105'
              : 'bg-slate-50/80 text-slate-600 hover:bg-slate-100/80 hover:text-slate-800 hover:scale-105 hover:shadow-md'
          }`}
          title="My Favorites"
        >
          {/* Subtle glow effect for active state */}
          {currentView === 'shortlist' && (
            <div className="absolute inset-0 bg-pink-400 rounded-xl blur-lg opacity-20 -z-10"></div>
          )}
          
          {/* Icon with gradient treatment for active state */}
          <Heart className={`h-5 w-5 transition-all duration-300 ${
            currentView === 'shortlist'
              ? 'text-pink-600 fill-current'
              : 'text-slate-600 group-hover:text-slate-800'
          }`} />
          
          {/* Badge - Integrated with icon */}
          {favoritesCount > 0 && (
            <div className={`absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 border-2 ${
              currentView === 'shortlist'
                ? 'bg-pink-600 text-white border-pink-600 shadow-sm'
                : 'bg-gradient-to-br from-pink-500 to-rose-500 text-white border-white shadow-md hover:shadow-lg'
            }`}>
              <span className="px-1">{favoritesCount > 99 ? '99+' : favoritesCount}</span>
            </div>
          )}
          
          {/* Subtle shimmer effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 rounded-xl"></div>
        </button>
      </nav>

      {/* Bottom Section - Spacer for visual balance */}
      <div className="pb-6">
        {/* Future: Could add user avatar, settings, or help button here */}
      </div>
    </div>
  );
};