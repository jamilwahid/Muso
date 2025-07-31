import React from 'react';
import { ShortlistCenterCard } from './ShortlistCenterCard';
import { KanbanBoardView } from './KanbanBoardView';
import { KanbanBoardView } from './KanbanBoardView';
import { Center } from '../types/center';
import { useFavorites } from '../contexts/FavoritesContext';
import { Heart, Sparkles, List, Kanban } from 'lucide-react';

interface ShortlistViewProps {
  centers: Center[];
  clearAllFilters: () => void;
}

export const ShortlistView: React.FC<ShortlistViewProps> = ({ centers }) => {
  const { favorites } = useFavorites();
  const [viewMode, setViewMode] = React.useState<'list' | 'board'>('list');
  const [viewMode, setViewMode] = React.useState<'list' | 'board'>('list');

  // Get the full center data for each favorited center
  const favoritedCenters = favorites.map(favoriteData => {
    const center = centers.find(c => c.center_id === favoriteData.center_id);
    return center ? { center, favoriteData } : null;
  }).filter(Boolean) as Array<{ center: Center; favoriteData: any }>;

  return (
    <div className="w-full h-full bg-gradient-to-br from-white/80 via-pink-50/40 to-rose-50/30 backdrop-blur-sm overflow-y-auto">
      <div className="px-6 lg:px-8 max-w-7xl mx-auto py-8">
        {/* View Toggle - Only show if there are favorites */}
        {favoritedCenters.length > 0 && (
          <div className="mb-8 flex justify-center">
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/30 p-1 hidden lg:flex">
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  viewMode === 'list'
                    ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <List className="h-4 w-4 mr-2 inline" />
                List View
              </button>
              <button
                onClick={() => setViewMode('board')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  viewMode === 'board'
                    ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Kanban className="h-4 w-4 mr-2 inline" />
                Board View
              </button>
            </div>
          </div>
        )}

        {/* View Toggle - Only show if there are favorites */}
        {favoritedCenters.length > 0 && (
          <div className="mb-8 flex justify-center">
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/30 p-1 hidden lg:flex">
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  viewMode === 'list'
                    ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <List className="h-4 w-4 mr-2 inline" />
                List View
              </button>
              <button
                onClick={() => setViewMode('board')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  viewMode === 'board'
                    ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Kanban className="h-4 w-4 mr-2 inline" />
                Board View
              </button>
            </div>
          </div>
        )}

        {favoritedCenters.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/30 max-w-lg mx-auto">
              <div className="text-slate-400 mb-6">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-pink-100 via-rose-100 to-purple-100 rounded-full flex items-center justify-center shadow-inner">
                  <Heart className="h-12 w-12 text-pink-400" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Your shortlist is empty</h3>
              <p className="text-slate-600 mb-8 leading-relaxed text-lg">
                Start building your shortlist by favoriting centers that catch your interest. 
                You can then track your progress and add personal notes here.
              </p>
              <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-6 border border-pink-100">
                <div className="flex items-center space-x-3 mb-3">
                  <Sparkles className="h-5 w-5 text-pink-500" />
                  <span className="font-semibold text-pink-800">Pro tip</span>
                </div>
                <p className="text-sm text-pink-700 leading-relaxed">
                  Look for the heart icon on center cards to add them to your shortlist. 
                  Once you have a few favorites, come back here to organize your next steps!
                </p>
              </div>
            </div>
          </div>
        ) : (
          viewMode === 'list' ? (
            <>
            {/* Header */}
            <div className="mb-8 text-center">
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-white/30 max-w-2xl mx-auto">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-3 rounded-2xl">
                    <Heart className="h-6 w-6 text-white fill-current" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">My Shortlist</h2>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Track your progress and organize your thoughts for each center you're considering. 
                  Use the checkboxes to mark completed actions and add personal notes to remember important details.
                </p>
                <div className="mt-4 text-sm text-pink-600 font-medium">
                  {favoritedCenters.length} center{favoritedCenters.length !== 1 ? 's' : ''} in your shortlist
                </div>
              </div>
            </div>

            {/* Shortlist Cards */}
            <div className="space-y-6">
              {favoritedCenters.map(({ center, favoriteData }, index) => (
                <div 
                  key={center.center_id}
                  className="transform transition-all duration-300"
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  <ShortlistCenterCard 
                    center={center} 
                    favoriteData={favoriteData} 
                  />
                </div>
              ))}
            </div>

            {/* Inspirational Footer */}
            <div className="mt-16 text-center">
              <div className="bg-gradient-to-r from-pink-50 via-rose-50 to-purple-50 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-white/30 max-w-2xl mx-auto">
                <div className="space-y-4">
                  <div className="text-4xl mb-4">🌟</div>
                  <h3 className="text-xl font-bold text-slate-800">
                    You're Making Great Progress!
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    Take your time to research and visit these centers. Trust your instincts, 
                    ask questions, and remember that the perfect fit is out there for your family.
                  </p>
                  <div className="flex items-center justify-center space-x-2 text-sm text-pink-600 font-medium">
                    <span>💡</span>
                    <span>Tip: Most centers appreciate a call before visiting</span>
                  </div>
                </div>
              </div>
            </div>
            </>
          ) : (
            /* Board View */
            <KanbanBoardView 
              centers={centers}
              favoritedCenters={favoritedCenters}
            />
          )
        )}
      </div>
    </div>
  );
};