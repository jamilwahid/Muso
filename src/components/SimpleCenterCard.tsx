import React from 'react';
import { MapPin, Star } from 'lucide-react';
import { Center } from '../types/center';

interface SimpleCenterCardProps {
  center: Center;
  onClick: () => void;
  preferenceRating?: string;
}

export const SimpleCenterCard: React.FC<SimpleCenterCardProps> = ({ 
  center, 
  onClick, 
  preferenceRating 
}) => {
  // Format address with postal code
  const formatAddress = () => {
    const baseAddress = center.location.address;
    const postalCode = center.location.postal_code;
    return postalCode ? `${baseAddress}, ${postalCode}` : baseAddress;
  };

  const getRatingEmoji = (rating: string) => {
    switch (rating) {
      case 'good': return '🙂';
      case 'great': return '😄';
      case 'excellent': return '😍';
      default: return null;
    }
  };

  return (
    <div 
      onClick={onClick}
      className="group bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:-translate-y-1"
    >
      <div className="p-4 sm:p-6">
        {/* Header with rating indicator */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg sm:text-xl font-bold text-slate-800 leading-tight flex-1 pr-4 group-hover:text-indigo-600 transition-colors duration-200">
            {center.center_name}
          </h3>
          {preferenceRating && (
            <div className="flex-shrink-0 text-2xl">
              {getRatingEmoji(preferenceRating)}
            </div>
          )}
        </div>
        
        {/* Address */}
        <div className="flex items-start text-sm text-slate-600">
          <MapPin className="h-4 w-4 mr-2 text-slate-400 flex-shrink-0 mt-0.5" />
          <span className="leading-relaxed">{formatAddress()}</span>
        </div>

        {/* Hover indicator */}
        <div className="mt-4 flex items-center text-xs text-slate-400 group-hover:text-indigo-500 transition-colors duration-200">
          <span>Click to view details</span>
          <svg className="ml-2 h-3 w-3 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
};