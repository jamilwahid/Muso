import React from 'react';
import { MapPin, Star, Phone, Heart, Clock } from 'lucide-react';
import { Center, FavoriteCenterData } from '../types/center';
import { useFavorites } from '../contexts/FavoritesContext';

interface KanbanCardProps {
  center: Center;
  favoriteData: FavoriteCenterData;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({ center, favoriteData }) => {
  const { removeFavorite } = useFavorites();

  const programsWithRating = center.programs.filter(p => p.quality_rating);
  const avgRating = programsWithRating.length > 0 
    ? programsWithRating.reduce((sum, p) => sum + (p.quality_rating || 0), 0) / programsWithRating.length
    : null;

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', center.center_id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleRemoveFromShortlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    removeFavorite(center.center_id);
  };

  // Format phone number for tel: link
  const formatPhoneForTel = (phone: string | null | undefined) => {
    if (!phone || typeof phone !== 'string') {
      return '';
    }
    
    const digits = phone.replace(/\D/g, '');
    
    if (digits.length === 10) {
      return `+1${digits}`;
    } else if (digits.length === 11 && digits.startsWith('1')) {
      return `+${digits}`;
    }
    
    return `+1${digits}`;
  };

  // Format address with postal code
  const formatAddress = () => {
    const baseAddress = center.location.address;
    const postalCode = center.location.postal_code;
    return postalCode ? `${baseAddress}, ${postalCode}` : baseAddress;
  };

  // Format last updated timestamp
  const formatLastUpdated = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) {
        return `${diffInDays}d ago`;
      } else {
        return date.toLocaleDateString();
      }
    }
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-move group"
    >
      <div className="p-3">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-bold text-sm text-slate-800 leading-tight flex-1 pr-2">
            {center.center_name}
          </h4>
          <button
            onClick={handleRemoveFromShortlist}
            className="opacity-0 group-hover:opacity-100 p-1 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600 transition-all duration-200"
            title="Remove from shortlist"
          >
            <Heart className="h-3 w-3 fill-current" />
          </button>
        </div>

        {/* Address */}
        <div className="flex items-start text-xs text-slate-500 mb-2">
          <MapPin className="h-3 w-3 mr-1 text-slate-400 flex-shrink-0 mt-0.5" />
          <span className="leading-relaxed">{formatAddress()}</span>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-1 mb-2">
          {center.CWELCC_participant && (
            <div className="inline-flex items-center bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 px-2 py-0.5 rounded-md text-xs font-medium border border-purple-200/60">
              CWELCC
            </div>
          )}
          
          {center.subsidy_available && (
            <div className="inline-flex items-center bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 px-2 py-0.5 rounded-md text-xs font-medium border border-purple-200/60">
              Subsidy
            </div>
          )}

          <div className="flex items-center space-x-1 bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 px-2 py-0.5 rounded-md text-xs font-medium border border-purple-200/60">
            <Star className={`h-2.5 w-2.5 ${
              avgRating 
                ? 'text-amber-400 fill-current' 
                : 'text-slate-400'
            }`} />
            <span>
              {avgRating ? avgRating.toFixed(1) : 'N/A'}
            </span>
          </div>
        </div>

        {/* Notes Preview */}
        {favoriteData.notes && (
          <div className="mb-2">
            <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg line-clamp-2">
              {favoriteData.notes}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          {/* Phone */}
          <div className="flex-1">
            {center.center_contact.phone ? (
              <a 
                href={`tel:${formatPhoneForTel(center.center_contact.phone)}`}
                className="inline-flex items-center space-x-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-2 py-1 rounded-lg text-xs font-bold hover:from-emerald-600 hover:to-teal-700 transition-all duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                <Phone className="h-2.5 w-2.5" />
                <span className="truncate max-w-[80px]">{center.center_contact.phone}</span>
              </a>
            ) : (
              <div className="inline-flex items-center space-x-1 bg-slate-100 text-slate-400 px-2 py-1 rounded-lg text-xs">
                <Phone className="h-2.5 w-2.5" />
                <span>No phone</span>
              </div>
            )}
          </div>

          {/* Last Updated */}
          <div className="flex items-center space-x-1 text-xs text-slate-400 ml-2">
            <Clock className="h-2.5 w-2.5" />
            <span>{formatLastUpdated(favoriteData.lastUpdated)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};