import React from 'react';
import { MapPin, Star, Phone, ExternalLink, Globe, Bookmark, Languages, Utensils } from 'lucide-react';
import { Center } from '../types/center';

interface CenterCardProps {
  center: Center;
}

export const CenterCard: React.FC<CenterCardProps> = ({ center }) => {
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
    // TODO: Implement save functionality
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
    <div className="group bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="space-y-5">
        {/* Header with Title and Top-Level Badges */}
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div className="flex-1 pr-4">
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                {center.center_name}
              </h3>
              
              <div className="flex items-center text-sm text-slate-500">
                <MapPin className="h-4 w-4 mr-2 text-slate-400" />
                <span className="font-medium">{formatAddress()}</span>
              </div>
            </div>
            
            {/* Rating */}
            <div className={`flex items-center space-x-1 px-3 py-2 rounded-xl ${
              avgRating 
                ? 'bg-amber-50 border border-amber-200/60' 
                : 'bg-slate-50 border border-slate-200/60'
            }`}>
              <Star className={`h-4 w-4 ${
                avgRating 
                  ? 'text-amber-400 fill-current' 
                  : 'text-slate-400'
              }`} />
              <span className={`text-sm font-bold ${
                avgRating 
                  ? 'text-amber-700' 
                  : 'text-slate-500'
              }`}>
                {avgRating ? avgRating.toFixed(1) : 'N/A'}
              </span>
            </div>
          </div>

          {/* Prominent CWELCC and Subsidy Badges */}
          <div className="flex items-center space-x-3">
            {center.CWELCC_participant && (
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-lg">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span>CWELCC Participant</span>
              </div>
            )}
            
            {center.subsidy_available && (
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-lg">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span>Subsidy Available</span>
              </div>
            )}
          </div>
        </div>

        {/* Horizontal Divider */}
        <div className="border-t border-slate-200/60"></div>

        {/* Language and Dietary Tags Section */}
        <div className="space-y-4">
          {/* Language Tags */}
          {center.languages_spoken.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Languages className="h-4 w-4 text-amber-600" />
                <span className="text-sm font-semibold text-slate-700">Languages Spoken</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {center.languages_spoken.slice(0, 3).map((language, index) => (
                  <div key={`lang-${index}`} className="inline-flex items-center bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 px-3 py-1.5 rounded-lg text-xs font-medium border border-amber-200/60">
                    {language}
                  </div>
                ))}
                {center.languages_spoken.length > 3 && (
                  <div className="inline-flex items-center bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 px-3 py-1.5 rounded-lg text-xs font-medium border border-amber-200/60">
                    +{center.languages_spoken.length - 3} more
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Dietary Services Tags */}
          {center.dietary_services.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Utensils className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-semibold text-slate-700">Dietary Services</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {center.dietary_services.slice(0, 3).map((service, index) => (
                  <div key={`diet-${index}`} className="inline-flex items-center bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 px-3 py-1.5 rounded-lg text-xs font-medium border border-purple-200/60">
                    {service}
                  </div>
                ))}
                {center.dietary_services.length > 3 && (
                  <div className="inline-flex items-center bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 px-3 py-1.5 rounded-lg text-xs font-medium border border-purple-200/60">
                    +{center.dietary_services.length - 3} more
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons Section */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200/60">
          {/* Phone Button */}
          <div className="flex-1">
            {center.center_contact.phone ? (
              <a 
                href={`tel:${formatPhoneForTel(center.center_contact.phone)}`}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <Phone className="h-4 w-4" />
                <span>{center.center_contact.phone}</span>
              </a>
            ) : (
              <div className="inline-flex items-center space-x-2 bg-slate-100 text-slate-400 px-4 py-2.5 rounded-xl text-sm font-medium cursor-not-allowed">
                <Phone className="h-4 w-4" />
                <span>No phone</span>
              </div>
            )}
          </div>

          {/* Action Icons */}
          <div className="flex items-center space-x-2">
            {/* Website Icon */}
            {center.center_contact.website ? (
              <button
                onClick={handleWebsiteClick}
                className="p-2.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-all duration-200 border border-blue-200/60"
                title="Visit center's website"
              >
                <Globe className="h-4 w-4" />
              </button>
            ) : (
              <div
                className="p-2.5 rounded-xl bg-slate-50 text-slate-300 border border-slate-200/60 cursor-not-allowed"
                title="Website unavailable"
              >
                <Globe className="h-4 w-4" />
              </div>
            )}

            {/* Official Listing Icon */}
            <button
              onClick={handleViewListing}
              className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700 transition-all duration-200 border border-indigo-200/60"
              title="View official listing on Toronto.ca"
            >
              <ExternalLink className="h-4 w-4" />
            </button>

            {/* Save Icon */}
            <button
              onClick={handleSaveCenter}
              className="p-2.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 transition-all duration-200 border border-rose-200/60"
              title="Save this center"
            >
              <Bookmark className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};