import React from 'react';
import { SimpleCenterCard } from './SimpleCenterCard';
import { CenterDetailSidepanel } from './CenterDetailSidepanel';
import { Center } from '../types/center';
import { useFavorites } from '../contexts/FavoritesContext';
import { Heart, Sparkles, Search, Filter } from 'lucide-react';
import { useState, useMemo } from 'react';

interface ShortlistViewProps {
  centers: Center[];
  clearAllFilters: () => void; // Keep this prop for now, though it might become unused
}

export const ShortlistView: React.FC<ShortlistViewProps> = ({ centers }) => {
  const { favorites, updateNotes, updateKanbanStatus } = useFavorites();
  const [selectedCenter, setSelectedCenter] = useState<Center | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'recent'>('name');
  const [centerNotes, setCenterNotes] = useState<{ [key: string]: string }>({});
  const [centerRatings, setCenterRatings] = useState<{ [key: string]: string }>({});
  const [centerFiles, setCenterFiles] = useState<{ [key: string]: any[] }>({});

  // Initialize local state from favorites data
  React.useEffect(() => {
    const notes: { [key: string]: string } = {};
    const ratings: { [key: string]: string } = {};
    const files: { [key: string]: any[] } = {};
    
    favorites.forEach(fav => {
      notes[fav.center_id] = fav.notes || '';
      ratings[fav.center_id] = fav.preferenceRating || '';
      files[fav.center_id] = fav.attachedFiles || [];
    });
    
    setCenterNotes(notes);
    setCenterRatings(ratings);
    setCenterFiles(files);
  }, [favorites]);

  // Debug logging
  console.log('ShortlistView - favorites:', favorites);
  console.log('ShortlistView - centers:', centers.length);

  // Get the full center data for each favorited center
  const allFavoritedCenters = favorites.map(favoriteData => {
    const center = centers.find(c => c.center_id === favoriteData.center_id);
    console.log('Looking for center:', favoriteData.center_id, 'found:', !!center);
    return center ? { center, favoriteData } : null;
  }).filter(Boolean) as Array<{ center: Center; favoriteData: any }>;

  // Filter and sort centers
  const filteredAndSortedCenters = useMemo(() => {
    let filtered = allFavoritedCenters;
    
    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(({ center }) =>
        center.center_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        center.location.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply sorting
    filtered.sort(({ center: a }, { center: b }) => {
      switch (sortBy) {
        case 'name':
          return a.center_name.localeCompare(b.center_name);
        case 'rating':
          const ratingA = centerRatings[a.center_id] || '';
          const ratingB = centerRatings[b.center_id] || '';
          const ratingOrder = { 'excellent': 3, 'great': 2, 'good': 1, '': 0 };
          return (ratingOrder[ratingB as keyof typeof ratingOrder] || 0) - (ratingOrder[ratingA as keyof typeof ratingOrder] || 0);
        case 'recent':
          const favA = favorites.find(f => f.center_id === a.center_id);
          const favB = favorites.find(f => f.center_id === b.center_id);
          return new Date(favB?.lastUpdated || 0).getTime() - new Date(favA?.lastUpdated || 0).getTime();
        default:
          return 0;
      }
    });
    
    return filtered;
  }, [allFavoritedCenters, searchQuery, sortBy, centerRatings, favorites]);

  const handleCenterClick = (center: Center) => {
    setSelectedCenter(center);
  };

  const handleNotesChange = (notes: string) => {
    if (selectedCenter) {
      setCenterNotes(prev => ({ ...prev, [selectedCenter.center_id]: notes }));
      updateNotes(selectedCenter.center_id, notes);
    }
  };

  const handleRatingChange = (rating: string) => {
    if (selectedCenter) {
      setCenterRatings(prev => ({ ...prev, [selectedCenter.center_id]: rating }));
      // Update in favorites context - we'll need to extend the context for this
    }
  };

  const handleFileUpload = (files: FileList) => {
    if (!selectedCenter) return;
    
    const newFiles = Array.from(files).map(file => ({
      id: Date.now() + Math.random().toString(36),
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
      uploadedAt: new Date().toISOString()
    }));
    
    setCenterFiles(prev => ({
      ...prev,
      [selectedCenter.center_id]: [...(prev[selectedCenter.center_id] || []), ...newFiles]
    }));
  };

  const handleFileDelete = (fileId: string) => {
    if (!selectedCenter) return;
    
    setCenterFiles(prev => ({
      ...prev,
      [selectedCenter.center_id]: (prev[selectedCenter.center_id] || []).filter(f => f.id !== fileId)
    }));
  };

  return (
    <>
      <div className="w-full h-full bg-gradient-to-br from-white/80 via-pink-50/40 to-rose-50/30 backdrop-blur-sm overflow-y-auto">
      <div className="px-6 lg:px-8 max-w-7xl mx-auto py-8">
          {allFavoritedCenters.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/30 max-w-lg mx-auto">
              <div className="text-slate-400 mb-6">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-pink-100 via-rose-100 to-purple-100 rounded-full flex items-center justify-center shadow-inner">
                  <Heart className="h-12 w-12 text-pink-400" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Your favorites list is empty</h3> {/* Updated text */}
              <p className="text-slate-600 mb-8 leading-relaxed text-lg">
                Start building your favorites by clicking the heart icon on center cards. 
                You can then track your progress and add personal notes here.
              </p>
              <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-6 border border-pink-100">
                <div className="flex items-center space-x-3 mb-3">
                  <Sparkles className="h-5 w-5 text-pink-500" />
                  <span className="font-semibold text-pink-800">Pro tip</span>
                </div>
                <p className="text-sm text-pink-700 leading-relaxed">
                  Look for the heart icon on center cards to add them to your favorites. 
                  Once you have a few favorites, come back here to organize your next steps!
                </p>
              </div>
            </div>
          </div>
        ) : (
            <>
              {/* Header with Search and Filters */}
              <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-800">My Shortlist</h1>
                    <p className="text-slate-600">
                      {filteredAndSortedCenters.length} of {allFavoritedCenters.length} centers
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search centers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="name">Sort by Name</option>
                      <option value="rating">Sort by Rating</option>
                      <option value="recent">Sort by Recent</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Center Cards Grid */}
              {filteredAndSortedCenters.length === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-8 shadow-lg border border-white/30 max-w-md mx-auto">
                    <Search className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">No centers found</h3>
                    <p className="text-slate-600">Try adjusting your search or filters</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAndSortedCenters.map(({ center }) => (
                    <SimpleCenterCard
                      key={center.center_id}
                      center={center}
                      onClick={() => handleCenterClick(center)}
                      preferenceRating={centerRatings[center.center_id]}
                    />
                  ))}
                </div>
              )}
            </>
        )}
      </div>
      </div>

      {/* Detail Sidepanel */}
      <CenterDetailSidepanel
        center={selectedCenter}
        isOpen={!!selectedCenter}
        onClose={() => setSelectedCenter(null)}
        notes={selectedCenter ? (centerNotes[selectedCenter.center_id] || '') : ''}
        onNotesChange={handleNotesChange}
        preferenceRating={selectedCenter ? (centerRatings[selectedCenter.center_id] || '') : ''}
        onPreferenceRatingChange={handleRatingChange}
        attachedFiles={selectedCenter ? (centerFiles[selectedCenter.center_id] || []) : []}
        onFileUpload={handleFileUpload}
        onFileDelete={handleFileDelete}
      />
    </>
  );
};