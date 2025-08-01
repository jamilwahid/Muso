import React, { useState, useRef } from 'react';
import { X, MapPin, Star, Phone, ExternalLink, Languages, Utensils, Link, Heart, Clock, CheckCircle2, Phone as PhoneIcon, Eye, FileText, Upload, Trash2, ChevronDown, ArrowRight } from 'lucide-react';
import { Center, FavoriteCenterData, KanbanStatus } from '../types/center';
import { useFavorites } from '../contexts/FavoritesContext';

interface CenterDetailSidePanelProps {
  center: Center;
  favoriteData: FavoriteCenterData;
  isOpen: boolean;
  onClose: () => void;
}

const KANBAN_STATUSES: Array<{ value: KanbanStatus; label: string; color: string; description: string }> = [
  { value: 'shortlisted', label: 'Shortlisted', color: 'pink', description: 'Centers you want to pursue' },
  { value: 'applied', label: 'Applied', color: 'blue', description: 'Application submitted' },
  { value: 'waitlist', label: 'On Waitlist', color: 'amber', description: 'Waiting for availability' },
  { value: 'approved', label: 'Approved', color: 'emerald', description: 'Offer received or accepted' }
];

export const CenterDetailSidePanel: React.FC<CenterDetailSidePanelProps> = ({
  center,
  favoriteData,
  isOpen,
  onClose
}) => {
  const { updateNotes, updatePersonalRating, addAttachment, removeAttachment, updateKanbanStatus } = useFavorites();
  const [notesValue, setNotesValue] = useState(favoriteData.notes);
  const [isRatingDropdownOpen, setIsRatingDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const programsWithRating = center.programs.filter(p => p.quality_rating);
  const avgRating = programsWithRating.length > 0 
    ? programsWithRating.reduce((sum, p) => sum + (p.quality_rating || 0), 0) / programsWithRating.length
    : null;

  // Personal rating options
  const ratingOptions: Array<{ value: '🙂' | '😄' | '😍' | null; label: string; emoji: string }> = [
    { value: null, label: 'No rating', emoji: '⚪' },
    { value: '🙂', label: 'Good', emoji: '🙂' },
    { value: '😄', label: 'Great', emoji: '😄' },
    { value: '😍', label: 'Love it!', emoji: '😍' }
  ];

  // Debounced notes update
  const debouncedUpdateNotes = React.useCallback(
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

  const handlePersonalRatingChange = (rating: '🙂' | '😄' | '😍' | null) => {
    console.log('Updating personal rating:', rating, 'for center:', center.center_id);
    updatePersonalRating(center.center_id, rating);
    setIsRatingDropdownOpen(false);
  };

  const handleStatusChange = (newStatus: KanbanStatus) => {
    updateKanbanStatus(center.center_id, newStatus);
    setIsStatusDropdownOpen(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const attachment = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file),
        uploadedAt: new Date().toISOString()
      };
      
      addAttachment(center.center_id, attachment);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveAttachment = (attachmentId: string) => {
    removeAttachment(center.center_id, attachmentId);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatAddress = () => {
    const baseAddress = center.location.address;
    const postalCode = center.location.postal_code;
    return postalCode ? `${baseAddress}, ${postalCode}` : baseAddress;
  };

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

  const handleWebsiteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (center.center_contact.website) {
      window.open(center.center_contact.website, '_blank');
    }
  };

  const currentStatus = KANBAN_STATUSES.find(s => s.value === favoriteData.kanbanStatus);
  const currentRating = ratingOptions.find(r => r.value === favoriteData.personalRating);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[200]"
        onClick={onClose}
      />
      
      {/* Side Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl z-[201] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-4">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-xl font-semibold text-gray-900">{center.center_name}</h1>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              
              <div className="flex items-start text-sm text-gray-600 mb-3">
                <MapPin className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{formatAddress()}</span>
              </div>
              
              {/* External Links */}
              <div className="text-sm text-gray-500 mb-4">
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
                <a 
                  href={center.center_listing_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 hover:text-indigo-600 hover:underline transition-colors duration-200"
                >
                  <Link className="h-3 w-3" />
                  <span>Toronto.ca listing</span>
                </a>
              </div>
              
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                {center.CWELCC_participant && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    CWELCC
                  </span>
                )}
                
                {center.subsidy_available && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Subsidy
                  </span>
                )}

                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  <Star className={`h-3 w-3 mr-1 ${
                    avgRating 
                      ? 'text-amber-400 fill-current' 
                      : 'text-gray-400'
                  }`} />
                  {avgRating ? avgRating.toFixed(1) : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Languages and Dietary Services in Header */}
          {(center.languages_spoken.length > 0 || center.dietary_services.length > 0) && (
            <div className="mt-4 space-y-3">
              {/* Languages */}
              {center.languages_spoken.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Languages className="h-4 w-4 text-slate-400" />
                    <span className="text-sm font-medium text-slate-600">Languages</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {center.languages_spoken.slice(0, 2).map((language, index) => (
                      <span key={`lang-${index}`} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {language}
                      </span>
                    ))}
                    {center.languages_spoken.length > 2 && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        +{center.languages_spoken.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Dietary Services */}
              {center.dietary_services.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Utensils className="h-4 w-4 text-slate-400" />
                    <span className="text-sm font-medium text-slate-600">Dietary Services</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {center.dietary_services.slice(0, 2).map((service, index) => (
                      <span key={`diet-${index}`} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {service}
                      </span>
                    ))}
                    {center.dietary_services.length > 2 && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        +{center.dietary_services.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="px-6 py-6 space-y-8">
          {/* Status and Rating */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Application Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Application Status
              </label>
              
              <div className="relative">
                <button
                  onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                  className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      currentStatus ? `bg-${currentStatus.color}-500` : 'bg-gray-400'
                    }`}></div>
                    <span className="text-sm text-gray-900">
                      {currentStatus?.label || 'Select Status'}
                    </span>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${
                    isStatusDropdownOpen ? 'rotate-180' : ''
                  }`} />
                </button>

                {isStatusDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                    {KANBAN_STATUSES.map((status) => (
                      <button
                        key={status.value}
                        onClick={() => handleStatusChange(status.value)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 hover:bg-gray-50 transition-colors ${
                          favoriteData.kanbanStatus === status.value ? 'bg-gray-50' : ''
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full bg-${status.color}-500`}></div>
                        <div className="text-left flex-1">
                          <div className="text-sm font-medium text-gray-900">{status.label}</div>
                          <div className="text-xs text-gray-500">{status.description}</div>
                        </div>
                        {favoriteData.kanbanStatus === status.value && (
                          <CheckCircle2 className="h-4 w-4 text-indigo-500" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Personal Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                My Rating
              </label>
              
              <div className="relative">
                <button
                  onClick={() => setIsRatingDropdownOpen(!isRatingDropdownOpen)}
                  className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{currentRating?.emoji || '⚪'}</span>
                    <span className="text-sm text-gray-900">
                      {currentRating?.label || 'No rating'}
                    </span>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${
                    isRatingDropdownOpen ? 'rotate-180' : ''
                  }`} />
                </button>

                {isRatingDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                    {ratingOptions.map((option) => (
                      <button
                        key={option.value || 'none'}
                        onClick={() => handlePersonalRatingChange(option.value)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 hover:bg-gray-50 transition-colors ${
                          favoriteData.personalRating === option.value ? 'bg-gray-50' : ''
                        }`}
                      >
                        <span className="text-lg">{option.emoji}</span>
                        <span className="text-sm text-gray-900 flex-1 text-left">{option.label}</span>
                        {favoriteData.personalRating === option.value && (
                          <CheckCircle2 className="h-4 w-4 text-indigo-500" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Contact Information</h3>
            
            <div className="space-y-3">
              {/* Contact Name */}
              {center.center_contact.name && (
                <div className="flex items-center space-x-2">
                  <div className="text-sm font-medium text-gray-700">Contact:</div>
                  <div className="text-sm text-gray-900">{center.center_contact.name}</div>
                </div>
              )}

              {/* Phone Number - Plain text with tel link */}
              {center.center_contact.phone ? (
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <a 
                    href={`tel:${formatPhoneForTel(center.center_contact.phone)}`}
                    className="text-sm text-indigo-600 hover:text-indigo-700 hover:underline"
                  >
                    {center.center_contact.phone}
                  </a>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500">No phone available</span>
                </div>
              )}

              {/* Website */}
              {center.center_contact.website && (
                <div className="flex items-center space-x-2">
                  <ExternalLink className="h-4 w-4 text-gray-500" />
                  <a 
                    href={center.center_contact.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-indigo-600 hover:text-indigo-700 hover:underline"
                  >
                    Visit Website
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Notes Section */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Notes
            </label>
            
            <textarea
              value={notesValue}
              onChange={handleNotesChange}
              placeholder="Add your thoughts, questions, or important details about this center..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
              rows={8}
            />
          </div>

          {/* File Attachments */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-900">
                Attachments
              </label>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center space-x-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
              >
                <Upload className="h-4 w-4" />
                <span>Add Files</span>
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx,.txt"
            />

            {favoriteData.attachments.length > 0 ? (
              <div className="space-y-2">
                {favoriteData.attachments.map((attachment) => (
                  <div key={attachment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-200 rounded-lg">
                        <FileText className="h-4 w-4 text-gray-500" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{attachment.name}</div>
                        <div className="text-xs text-gray-500">
                          {formatFileSize(attachment.size)} • {new Date(attachment.uploadedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveAttachment(attachment.id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No files attached yet</p>
                <p className="text-xs text-gray-400 mt-1">Click "Add Files" to upload documents</p>
              </div>
            )}
          </div>

          {/* City Support Notes */}
          {center.city_support_notes && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">
                City Support Notes
              </h4>
              <p className="text-sm text-blue-800">{center.city_support_notes}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};