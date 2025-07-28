import React, { useState, useCallback } from 'react';
import { MapPin, Star, Phone, ExternalLink, Languages, Utensils, Link, Heart, Clock, CheckCircle2, Phone as PhoneIcon, Eye, FileText } from 'lucide-react';
import { Center, FavoriteCenterData, FavoriteActions } from '../types/center';
import { useFavorites } from '../contexts/FavoritesContext';

interface ShortlistCenterCardProps {
  center: Center;
  favoriteData: FavoriteCenterData;
}

export const ShortlistCenterCard: React.FC<ShortlistCenterCardProps> = ({ center, favoriteData }) => {
  const { toggleAction, updateNotes, removeFavorite } = useFavorites();
  const [notesValue, setNotesValue] = useState(favoriteData.notes);

  const programsWithRating = center.programs.filter(p => p.quality_rating);
  const avgRating = programsWithRating.length > 0 
    ? programsWithRating.reduce((sum, p) => sum + (p.quality_rating || 0), 0) / programsWithRating.length
    : null;

  // Debounced notes update
  const debouncedUpdateNotes = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (newNotes: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          updateNotes(center.center_id, newNotes);
        }, 500);
      };
    })(),
    [center.center_id, updateNotes]
  );

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setNotesValue(newValue);
    debouncedUpdateNotes(newValue);
  };

  const handleActionToggle = (actionKey: keyof FavoriteActions) => {
    toggleAction(center.center_id, actionKey);
  };

  const handleRemoveFromShortlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeFavorite(center.center_id);
  };

  const handleViewListing = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(center.center_listing_url, '_blank');
  };

  const handleWebsiteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (center.center_contact.website) {
      window.open(center.center_contact.website, '_blank');
    }
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
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) {
        return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
      } else {
        return date.toLocaleDateString();
      }
    }
  };

  const actionItems = [
    { key: 'called' as keyof FavoriteActions, label: 'Called', icon: PhoneIcon, color: 'emerald' },
    { key: 'visited' as keyof FavoriteActions, label: 'Visited', icon: Eye, color: 'blue' },
    { key: 'applied' as keyof FavoriteActions, label: 'Applied', icon: FileText, color: 'purple' }
  ];

  return (
    <div className="bg-white/90 backdrop-blur-sm border border-pink-200/60 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ring-1 ring-pink-100/50">
      <div className="p-4 sm:p-6">
        {/* Header Section */}
        <div className="mb-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg sm:text-xl font-bold text-slate-800 leading-tight flex-1 pr-4">
              {center.center_name}
            </h3>
            <button
              onClick={handleRemoveFromShortlist}
              className="p-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600 transition-all duration-200 shadow-lg hover:shadow-xl"
              title="Remove from shortlist"
            >
              <Heart className="h-4 w-4 fill-current" />
            </button>
          </div>
          
          <div className="flex items-start text-sm text-slate-500 mb-2">
            <MapPin className="h-4 w-4 mr-2 text-slate-400 flex-shrink-0 mt-0.5" />
            <span className="font-medium leading-relaxed">{formatAddress()}</span>
          </div>
          
          {/* External Links */}
          <div className="text-sm text-slate-500">
            {center.center_contact.website && (
              <button
                onClick={handleWebsiteClick}
                className="inline-flex items-center space-x-1 hover:text-blue-600 hover:underline transition-colors duration-200"
              >
                <Link className="h-3 w-3" />
                <span>Website</span>
              </button>
            )}
            {center.center_contact.website && <span className="mx-2">·</span>}
            <button 
              onClick={handleViewListing}
              className="inline-flex items-center space-x-1 hover:text-indigo-600 hover:underline transition-colors duration-200"
            >
              <Link className="h-3 w-3" />
              <span>Toronto.ca listing</span>
            </button>
          </div>
        </div>

        {/* Badges Row */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {center.CWELCC_participant && (
            <div className="inline-flex items-center bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 px-3 py-1 rounded-lg text-sm font-medium border border-purple-200/60">
              <span>CWELCC</span>
            </div>
          )}
          
          {center.subsidy_available && (
            <div className="inline-flex items-center bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 px-3 py-1 rounded-lg text-sm font-medium border border-purple-200/60">
              <span>Subsidy</span>
            </div>
          )}

          <div className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-sm font-medium border ${
            avgRating 
              ? 'bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 border-purple-200/60' 
              : 'bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 border-purple-200/60'
          }`}>
            <Star className={`h-3.5 w-3.5 ${
              avgRating 
                ? 'text-amber-400 fill-current' 
                : 'text-slate-400'
            }`} />
            <span>
              {avgRating ? avgRating.toFixed(1) : 'N/A'}
            </span>
          </div>
        </div>

        {/* Language and Dietary Tags */}
        {(center.languages_spoken.length > 0 || center.dietary_services.length > 0) && (
          <div className="mb-4 space-y-3">
            {center.languages_spoken.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Languages className="h-4 w-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-600">Languages</span>
                </div>
                <div className="flex flex-wrap gap-1 ml-6">
                  {center.languages_spoken.slice(0, 3).map((language, index) => (
                    <div key={`lang-${index}`} className="inline-flex items-center bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 px-2 py-1 rounded-lg text-xs font-medium border border-purple-200/60">
                      {language}
                    </div>
                  ))}
                  {center.languages_spoken.length > 3 && (
                    <div className="inline-flex items-center bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 px-2 py-1 rounded-lg text-xs font-medium border border-purple-200/60">
                      +{center.languages_spoken.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            )}

            {center.dietary_services.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Utensils className="h-4 w-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-600">Dietary</span>
                </div>
                <div className="flex flex-wrap gap-1 ml-6">
                  {center.dietary_services.slice(0, 3).map((service, index) => (
                    <div key={`diet-${index}`} className="inline-flex items-center bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 px-2 py-1 rounded-lg text-xs font-medium border border-purple-200/60">
                      {service}
                    </div>
                  ))}
                  {center.dietary_services.length > 3 && (
                    <div className="inline-flex items-center bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 px-2 py-1 rounded-lg text-xs font-medium border border-purple-200/60">
                      +{center.dietary_services.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-slate-200 my-4"></div>

        {/* Action Tracking Section */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 text-slate-500" />
            <span>Progress Tracking</span>
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {actionItems.map(({ key, label, icon: Icon, color }) => {
              const isCompleted = favoriteData.actions[key];
              return (
                <button
                  key={key}
                  onClick={() => handleActionToggle(key)}
                  className={`flex items-center space-x-3 p-3 rounded-xl border-2 transition-all duration-200 ${
                    isCompleted
                      ? `border-${color}-200 bg-gradient-to-r from-${color}-50 to-${color}-100 text-${color}-700 shadow-sm`
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${
                    isCompleted
                      ? `bg-${color}-500 text-white`
                      : 'bg-slate-100 text-slate-400'
                  }`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium">{label}</div>
                    {isCompleted && (
                      <div className="text-xs opacity-75">Completed</div>
                    )}
                  </div>
                  {isCompleted && (
                    <CheckCircle2 className={`h-5 w-5 text-${color}-500`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Notes Section */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center space-x-2">
            <FileText className="h-4 w-4 text-slate-500" />
            <span>My Notes</span>
          </h4>
          
          <textarea
            value={notesValue}
            onChange={handleNotesChange}
            placeholder="Add your thoughts, questions, or important details about this center..."
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none transition-all duration-200"
            rows={3}
          />
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200 my-4"></div>

        {/* Contact and Last Updated */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          {/* Phone Button */}
          <div className="flex-1">
            {center.center_contact.phone ? (
              <a 
                href={`tel:${formatPhoneForTel(center.center_contact.phone)}`}
                className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-3 rounded-xl text-sm font-bold hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl w-full sm:w-auto touch-manipulation"
                onClick={(e) => e.stopPropagation()}
              >
                <Phone className="h-4 w-4" />
                <span className="truncate">{center.center_contact.phone}</span>
              </a>
            ) : (
              <div className="inline-flex items-center justify-center space-x-2 bg-slate-100 text-slate-400 px-4 py-3 rounded-xl text-sm font-medium cursor-not-allowed w-full sm:w-auto">
                <Phone className="h-4 w-4" />
                <span>No phone</span>
              </div>
            )}
          </div>

          {/* Last Updated */}
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <Clock className="h-3.5 w-3.5" />
            <span>Updated {formatLastUpdated(favoriteData.lastUpdated)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};