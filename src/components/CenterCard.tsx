import React, { useState } from 'react';
import { MapPin, Star, Phone, ExternalLink, Bookmark, Languages, Utensils, Link, Sparkles, Clock } from 'lucide-react';
import { Center } from '../types/center';

interface CenterCardProps {
  center: Center;
}

export const CenterCard: React.FC<CenterCardProps> = ({ center }) => {
  const [showComingSoon, setShowComingSoon] = useState(false);
  
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
    setShowComingSoon(true);
    // Auto-hide the tooltip after 3 seconds
    setTimeout(() => {
      setShowComingSoon(false);
    }, 3000);
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

        {/* Badges Row - CWELCC, Subsidy, and Rating together */}
        <div className="flex flex-wrap items-center gap-1.5 mb-2">
          {center.CWELCC_participant && (
<div className="inline-flex items-center bg-gray-50 text-gray-900 px-2 py-1 rounded-lg text-xs font-medium border border-gray-300 shadow-sm">


              <span>CWELCC</span>
            </div>
          )}
          
          {center.subsidy_available && (
<div className="inline-flex items-center bg-amber-50 text-amber-800 px-2 py-1 rounded-lg text-xs font-medium border border-amber-200">

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
              {/* Save Button - Coming Soon Feature */}
              <div className="relative">
                <button
                data-onboarding="save-button"
                onClick={handleSaveCenter}
                  className="relative p-2 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl border-2 touch-manipulation h-10 w-10 flex items-center justify-center bg-gradient-to-r from-amber-500 to-orange-500 text-white border-white/20 hover:from-amber-600 hover:to-orange-600 group overflow-hidden"
                  title="Save to My List - Coming Soon!"
                >
                  {/* Animated background sparkles */}
                  <div className="absolute inset-0 opacity-30">
                    <Sparkles className="h-2 w-2 absolute top-1 left-1 animate-pulse" />
                    <Sparkles className="h-1.5 w-1.5 absolute bottom-1 right-1 animate-pulse delay-300" />
                  </div>
                  
                  <Bookmark className="h-3.5 w-3.5 relative z-10" />
                  
                  {/* Pulsing "new feature" indicator */}
                  <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-gradient-to-r from-pink-400 to-red-500 rounded-full animate-pulse"></div>
                  
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                </button>
                
                {/* Coming Soon Tooltip */}
                {showComingSoon && (
                  <div className="absolute bottom-full right-0 mb-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 text-white px-4 py-3 rounded-2xl shadow-2xl border border-white/20 backdrop-blur-xl min-w-[280px]">
                      <div className="flex items-center space-x-3">
                        <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                          <Clock className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-bold text-sm mb-1">🚀 Coming Soon!</div>
                          <div className="text-xs opacity-90 leading-relaxed">
                            Save your favorite centers, track your shortlist, and stay on top of next steps — <em>all in one place</em> !
                          </div>
                        </div>
                      </div>
                      
                      {/* Tooltip arrow */}
                      <div className="absolute top-full right-4 transform">
                        <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-orange-500"></div>
                      </div>
                      
                      {/* Animated sparkles */}
                      <div className="absolute inset-0 pointer-events-none">
                        <Sparkles className="h-3 w-3 absolute top-2 right-2 text-white/60 animate-pulse" />
                        <Sparkles className="h-2 w-2 absolute bottom-2 left-2 text-white/40 animate-pulse delay-500" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};