import React from 'react';
import { MapPin, Star, Phone, ExternalLink, User, Globe, FileText } from 'lucide-react';
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

  // Format phone number for tel: link (remove all non-digits and format)
  const formatPhoneForTel = (phone: string | null | undefined) => {
    // Check if phone is null, undefined, or empty string
    if (!phone || typeof phone !== 'string') {
      return '';
    }
    
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');
    
    // If it's a North American number (10 or 11 digits), format appropriately
    if (digits.length === 10) {
      return `+1${digits}`;
    } else if (digits.length === 11 && digits.startsWith('1')) {
      return `+${digits}`;
    }
    
    // For other formats, just return the digits with +1 prefix
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
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex-1 pr-4">
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              {center.center_name}
            </h3>
            
            <div className="flex items-center text-sm text-slate-500 mb-1">
              <MapPin className="h-4 w-4 mr-2 text-slate-400" />
              <span className="font-medium">{formatAddress()}</span>
            </div>
          </div>
          
          {/* Website Icon, Listing Icon, and Rating */}
          <div className="flex items-center space-x-2">
            {/* Website Icon */}
            {center.center_contact.website ? (
              <button
                onClick={handleWebsiteClick}
                className="p-1.5 rounded-lg text-blue-600 hover:text-blue-800 transition-colors duration-200 cursor-pointer"
                title="Visit center's website"
              >
                <Globe className="h-4 w-4" />
              </button>
            ) : (
              <div
                className="p-1.5 rounded-lg text-slate-300 cursor-default"
                title="Website unavailable"
              >
                <Globe className="h-4 w-4" />
              </div>
            )}

            {/* Official Listing Icon */}
            <button
              onClick={handleViewListing}
              className="p-1.5 rounded-lg text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
              title="View official listing on Toronto.ca"
            >
              <ExternalLink className="h-4 w-4" />
            </button>

            {/* Rating */}
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg ${
              avgRating 
                ? 'bg-amber-50' 
                : 'bg-slate-50'
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
        </div>

        {/* Contact Information */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-center space-x-2 text-sm">
            <User className="h-4 w-4 text-indigo-500" />
            <span className="font-medium text-slate-700">{center.center_contact.name}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <Phone className="h-4 w-4 text-emerald-500 mr-2" />
            {center.center_contact.phone ? (
              <a 
                href={`tel:${formatPhoneForTel(center.center_contact.phone)}`}
                className="font-medium text-emerald-600 hover:text-emerald-800 transition-colors duration-200 hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                {center.center_contact.phone}
              </a>
            ) : (
              <span className="font-medium text-slate-400">No phone</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};