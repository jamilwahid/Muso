import React, { useState } from 'react';
import { MapPin, Star, Phone, ExternalLink, Bookmark, Languages, Utensils, Link } from 'lucide-react';
import { Center } from '../types/center';

interface CenterCardProps {
  center: Center;
}

export const CenterCard: React.FC<CenterCardProps> = ({ center }) => {
  const [isSaved, setIsSaved] = useState(false); // TODO: Connect to actual save state
  
  const programsWithRating = center.programs.filter(p => p.quality_rating);
  const avgRating = programsWithRating.length > 0 
    ? programsWithRating.reduce((sum, p) => sum + (p.quality_rating || 0), 0) / programsWithRating.length
    : null;

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

  const handleSaveCenter = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
    // TODO: Implement actual save functionality
    console.log('Save center:', center.center_id);
  };

  // Format phone number for tel: link (remove all non-digits and format)
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

  return (
    <div className="group bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="p-3 sm:p-4">
        {/* Header Section - Name and Address with full horizontal space */}
        <div className="mb-2">
          <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-1 leading-tight">
            {center.center_name}
          </h3>
          
          <div className="flex items-start text-xs sm:text-sm text-slate-500">
            <MapPin className="h-3.5 w-3.5 mr-1.5 text-slate-400 flex-shrink-0 mt-0.5" />
            <span className="font-medium leading-relaxed">{formatAddress()}</span>
          </div>
          
          {/* External Links - Below address */}
          <div className="mt-1 text-sm text-slate-500">
            <button
              onClick={handleViewListing}
              className="hover:text-indigo-600 hover:underline transition-colors duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              📄 Toronto.ca listing
            </button>
            {center.center_contact.website && (
              <>
                <span className="mx-2">·</span>
                <button
                  onClick={handleWebsiteClick}
                  className="hover:text-blue-600 hover:underline transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  🌐 Website
                </button>
              </>
            )}
          </div>
        </div>

        {/* Badges Row - CWELCC, Subsidy, and Rating together */}
        <div className="flex flex-wrap items-center gap-1.5 mb-2">
          {center.CWELCC_participant && (
            <div className="inline-flex items-center bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 px-2 py-1 rounded-lg text-xs font-medium border border-purple-200/60">
              <span>CWELCC</span>
            </div>
          )}
          
          {center.subsidy_available && (
            <div className="inline-flex items-center bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 px-2 py-1 rounded-lg text-xs font-medium border border-purple-200/60">
              <span>Subsidy</span>
            </div>
          )}

          {/* Rating Badge - Moved here next to other badges */}
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-medium border ${
            avgRating 
              ? 'bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 border-purple-200/60' 
              : 'bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 border-purple-200/60'
          }`}>
            <Star className={`h-3 w-3 ${
              avgRating 
                ? 'text-amber-400 fill-current' 
                : 'text-slate-400'
            }`} />
            <span>
              {avgRating ? avgRating.toFixed(1) : 'N/A'}
            </span>
          </div>
        </div>

        {/* Horizontal divider */}
        <div className="border-t border-slate-100 my-2"></div>

        {/* Language and Dietary Tags Section - Improved spacing and grouping */}
        {(center.languages_spoken.length > 0 || center.dietary_services.length > 0) && (
          <div className="mb-2 space-y-2">
            {/* Language Tags - Using same icon as filter UI */}
            {center.languages_spoken.length > 0 && (
              <div className="space-y-1">
                <div className="flex items-center space-x-1.5">
                  <Languages className="h-3.5 w-3.5 text-slate-400" />
                  <span className="text-sm font-medium text-slate-600">Languages</span>
                </div>
                <div className="flex flex-wrap gap-1 ml-5">
                  {center.languages_spoken.slice(0, 2).map((language, index) => (
                    <div key={`lang-${index}`} className="inline-flex items-center bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 px-2 py-1 rounded-lg text-xs font-medium border border-purple-200/60">
                      {language}
                    </div>
                  ))}
                  {center.languages_spoken.length > 2 && (
                    <div className="inline-flex items-center bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 px-2 py-1 rounded-lg text-xs font-medium border border-purple-200/60">
                      +{center.languages_spoken.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Dietary Services Tags - Using same icon as filter UI */}
            {center.dietary_services.length > 0 && (
              <div className="space-y-1">
                <div className="flex items-center space-x-1.5">
                  <Utensils className="h-3.5 w-3.5 text-slate-400" />
                  <span className="text-sm font-medium text-slate-600">Dietary</span>
                </div>
                <div className="flex flex-wrap gap-1 ml-5">
                  {center.dietary_services.slice(0, 2).map((service, index) => (
                    <div key={`diet-${index}`} className="inline-flex items-center bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 px-2 py-1 rounded-lg text-xs font-medium border border-purple-200/60">
                      {service}
                    </div>
                  ))}
                  {center.dietary_services.length > 2 && (
                    <div className="inline-flex items-center bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 px-2 py-1 rounded-lg text-xs font-medium border border-purple-200/60">
                      +{center.dietary_services.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Horizontal divider before actions */}
        <div className="border-t border-slate-100 my-2"></div>

        {/* Action Buttons Section - Equal height and consistent styling */}
        <div className="pt-1">
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            {/* Phone Button - Primary action */}
            <div className="flex-1">
              {center.center_contact.phone ? (
                <a 
                  href={`tel:${formatPhoneForTel(center.center_contact.phone)}`}
                  className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-3 py-2 rounded-xl text-xs font-bold hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl w-full sm:w-auto touch-manipulation h-10"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span className="truncate">{center.center_contact.phone}</span>
                </a>
              ) : (
                <div className="inline-flex items-center justify-center space-x-2 bg-slate-100 text-slate-400 px-3 py-2 rounded-xl text-xs font-medium cursor-not-allowed w-full sm:w-auto h-10">
                  <Phone className="h-3.5 w-3.5" />
                  <span>No phone</span>
                </div>
              )}
            </div>

            {/* Secondary Actions - Equal height and consistent spacing */}
            <div className="flex items-center justify-center sm:justify-end space-x-2">
              {/* Save Button - Icon with clear saved/unsaved state */}
              <button
                onClick={handleSaveCenter}
                className={`relative p-2 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl border-2 touch-manipulation h-10 w-10 flex items-center justify-center ${
                  isSaved 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-white/20 hover:from-indigo-600 hover:to-purple-700' 
                    : 'bg-white text-indigo-600 border-indigo-200/60 hover:bg-indigo-50'
                }`}
                title={isSaved ? "Saved to My List" : "Save to My List"}
              >
                <Bookmark className={`h-3.5 w-3.5 ${isSaved ? 'fill-current' : ''}`} />
                {!isSaved && (
                  <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"></div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};