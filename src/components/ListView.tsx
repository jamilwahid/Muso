import React from 'react';
import { CenterCard } from './CenterCard';
import { Center, Filters } from '../types/center';

interface ListViewProps {
  filteredCenters: Center[];
  clearAllFilters: () => void;
  activeFilters: Filters;
}

export const ListView: React.FC<ListViewProps> = ({ 
  filteredCenters, 
  clearAllFilters,
  activeFilters
}) => {
  return (
    <div className="w-full h-full bg-gradient-to-br from-white/80 via-indigo-50/40 to-purple-50/30 backdrop-blur-sm overflow-y-auto">
      <div className="px-6 lg:px-8 max-w-7xl mx-auto py-8">
        {filteredCenters.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/30 max-w-lg mx-auto">
              <div className="text-slate-400 mb-6">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 rounded-full flex items-center justify-center shadow-inner">
                  <span className="text-4xl">🔍</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">No centers match your filters</h3>
              <p className="text-slate-600 mb-8 leading-relaxed text-lg">Try adjusting your search criteria to discover more options that fit your family's unique needs.</p>
              <button
                onClick={clearAllFilters}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
              >
                Explore All Centers
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
              {filteredCenters.map((center, index) => (
                <div 
                  key={center.center_id}
                  className="transform transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1"
                  style={{
                    animationDelay: `${index * 50}ms`
                  }}
                >
                  <CenterCard center={center} activeFilters={activeFilters} />
                </div>
              ))}
            </div>

            {/* Inspirational Footer */}
            {filteredCenters.length > 0 && (
              <div className="mt-16 text-center">
                <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-white/30 max-w-2xl mx-auto">
                  <div className="space-y-4">
                    <div className="text-4xl mb-4">✨</div>
                    <h3 className="text-xl font-bold text-slate-800">
                      Found Your Perfect Match?
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      Remember to call centers directly - many have more availability than shown online. 
                      Visit in person when possible to get the full picture!
                    </p>
                    <div className="flex items-center justify-center space-x-2 text-sm text-indigo-600 font-medium">
                      <span>💡</span>
                      <span>Pro tip: Ask about waitlist positions and upcoming openings</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};