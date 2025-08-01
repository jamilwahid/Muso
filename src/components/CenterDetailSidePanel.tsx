import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
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

  const modalContent = (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Modal Container */}
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-white/20 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Fixed */}
        <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-3">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-xl font-bold text-gray-900">{center.center_name}</h1>
                <button
                  onClick={onClose}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              
              <div className="flex items-start text-sm text-gray-600 mb-3">
                <MapPin className="h-4 w-4 mr-1.5 text-gray-400 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{formatAddress()}</span>
              </div>
              
              {/* External Links */}
              <div className="text-sm text-gray-500 mb-3">
                {center.center_contact.website && (
                  <button
                    onClick={handleWebsiteClick}
                    className="inline-flex items-center space-x-1 hover:text-blue-600 hover:underline transition-colors duration-200"
                  >
                    <Link className="h-3.5 w-3.5" />
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
                  <Link className="h-3.5 w-3.5" />
                  <span>Toronto.ca listing</span>
                </a>
              </div>
              
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                {center.CWELCC_participant && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                    CWELCC
                  </span>
                )}
                
                {center.subsidy_available && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                    Subsidy
                  </span>
                )}

                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
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

        </div>

        {/* Status and Rating - Header Level - Fixed */}
        <div className="flex-shrink-0 px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Application Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Application Status
              </label>
              
              <div className="relative">
                <button
                  onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                  className="w-full flex items-center justify-between px-3 py-2.5 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      currentStatus ? `bg-${currentStatus.color}-500` : 'bg-gray-400'
                    }`}></div>
                    <span className="text-sm font-medium text-gray-900">
                      {currentStatus?.label || 'Select Status'}
                    </span>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${
                    isStatusDropdownOpen ? 'rotate-180' : ''
                  }`} />
                </button>

                {isStatusDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden">
                    {KANBAN_STATUSES.map((status) => (
                      <button
                        key={status.value}
                        onClick={() => handleStatusChange(status.value)}
                        className={`w-full flex items-center space-x-3 px-3 py-2.5 hover:bg-gray-50 transition-colors ${
                          favoriteData.kanbanStatus === status.value ? 'bg-gray-50' : ''
                        }`}
                      >
                        <div className={`w-3 h-3 rounded-full bg-${status.color}-500`}></div>
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
                  className="w-full flex items-center justify-between px-3 py-2.5 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{currentRating?.emoji || '⚪'}</span>
                    <span className="text-sm font-medium text-gray-900">
                      {currentRating?.label || 'No rating'}
                    </span>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${
                    isRatingDropdownOpen ? 'rotate-180' : ''
                  }`} />
                </button>

                {isRatingDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden">
                    {ratingOptions.map((option) => (
                      <button
                        key={option.value || 'none'}
                        onClick={() => handlePersonalRatingChange(option.value)}
                        className={`w-full flex items-center space-x-3 px-3 py-2.5 hover:bg-gray-50 transition-colors ${
                          favoriteData.personalRating === option.value ? 'bg-gray-50' : ''
                        }`}
                      >
                        <span className="text-base">{option.emoji}</span>
                        <span className="text-sm font-medium text-gray-900 flex-1 text-left">{option.label}</span>
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
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {/* Languages and Dietary Services - Moved here and made more compact */}
          {(center.languages_spoken.length > 0 || center.dietary_services.length > 0) && (
            <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Languages */}
                {center.languages_spoken.length > 0 && (
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Languages className="h-4 w-4 text-slate-400" />
                      <span className="text-sm font-medium text-slate-600">Languages</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {center.languages_spoken.slice(0, 3).map((language, index) => (
                        <span key={`lang-${index}`} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                          {language}
                        </span>
                      ))}
                      {center.languages_spoken.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                          +{center.languages_spoken.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Dietary Services */}
                {center.dietary_services.length > 0 && (
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Utensils className="h-4 w-4 text-slate-400" />
                      <span className="text-sm font-medium text-slate-600">Dietary Services</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {center.dietary_services.slice(0, 3).map((service, index) => (
                        <span key={`diet-${index}`} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                          {service}
                        </span>
                      ))}
                      {center.dietary_services.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                          +{center.dietary_services.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Contact Information */}
          <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center space-x-2">
              <Phone className="h-5 w-5 text-slate-600" />
              <span>Contact Information</span>
            </h3>
            
            <div className="space-y-3">
              {/* Contact Name */}
              {center.center_contact.name && (
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  <div className="text-sm font-medium text-gray-700">Contact:</div>
                  <div className="text-sm text-gray-900 font-medium">{center.center_contact.name}</div>
                </div>
              )}

              {/* Phone Number - Plain text with tel link */}
              {center.center_contact.phone ? (
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <a 
                    href={`tel:${formatPhoneForTel(center.center_contact.phone)}`}
                    className="text-sm text-indigo-600 hover:text-indigo-700 hover:underline font-medium"
                  >
                    {center.center_contact.phone}
                  </a>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500">No phone available</span>
                </div>
              )}

              {/* Website */}
              {center.center_contact.website && (
                <div className="flex items-center space-x-3">
                  <ExternalLink className="h-4 w-4 text-gray-500" />
                  <a 
                    href={center.center_contact.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-indigo-600 hover:text-indigo-700 hover:underline font-medium"
                  >
                    Visit Website
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Notes Section */}
          <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center space-x-2">
              <FileText className="h-5 w-5 text-slate-600" />
              <span>My Notes</span>
            </h3>
            
            <textarea
              value={notesValue}
              onChange={handleNotesChange}
              placeholder="Add your thoughts, questions, or important details about this center..."
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none shadow-sm transition-all duration-200 text-sm"
              rows={4}
            />
          </div>

          {/* File Attachments */}
          <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center space-x-2">
                <Upload className="h-5 w-5 text-slate-600" />
                <span>Attachments</span>
              </h3>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center space-x-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-2 rounded-lg transition-all duration-200"
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
              <div className="space-y-4">
                {favoriteData.attachments.map((attachment) => (
                  <div key={attachment.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
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
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50/50">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-500 mb-1">No files attached yet</p>
                <p className="text-xs text-gray-400">Click "Add Files" to upload documents</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Render the modal at the document root level to avoid scroll container issues
  return createPortal(modalContent, document.body);
};