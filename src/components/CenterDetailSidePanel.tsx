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
        <div className="sticky top-0 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 p-6 z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-4">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">{center.center_name}</h2>
              <div className="flex items-start text-sm text-slate-600">
                <MapPin className="h-4 w-4 mr-2 text-slate-400 flex-shrink-0 mt-0.5" />
                <span className="font-medium leading-relaxed">{formatAddress()}</span>
              </div>
              
              {/* Badges under address */}
              <div className="flex flex-wrap items-center gap-2 mt-3">
                {center.CWELCC_participant && (
                  <div className="inline-flex items-center bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 px-3 py-1.5 rounded-lg text-sm font-semibold border border-purple-200">
                    CWELCC Participant
                  </div>
                )}
                
                {center.subsidy_available && (
                  <div className="inline-flex items-center bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 px-3 py-1.5 rounded-lg text-sm font-semibold border border-emerald-200">
                    Subsidy Available
                  </div>
                )}

                <div className="flex items-center space-x-2 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 px-3 py-1.5 rounded-lg text-sm font-semibold border border-amber-200">
                  <Star className={`h-4 w-4 ${
                    avgRating 
                      ? 'text-amber-500 fill-current' 
                      : 'text-slate-400'
                  }`} />
                  <span>
                    {avgRating ? `${avgRating.toFixed(1)} Rating` : 'No Rating'}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all duration-200 hover:scale-105"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Status and Rating Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Kanban Status */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700 flex items-center space-x-2">
                <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                <span>Application Status</span>
              </label>
              
              <div className="relative">
                <button
                  onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 ${
                    currentStatus
                      ? `border-${currentStatus.color}-200 bg-gradient-to-r from-${currentStatus.color}-50 to-${currentStatus.color}-100`
                      : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      currentStatus ? `bg-${currentStatus.color}-500` : 'bg-slate-400'
                    }`}></div>
                    <div className="text-left">
                      <div className="font-semibold text-slate-900">
                        {currentStatus?.label || 'Select Status'}
                      </div>
                      {currentStatus && (
                        <div className="text-xs text-slate-600">{currentStatus.description}</div>
                      )}
                    </div>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${
                    isStatusDropdownOpen ? 'rotate-180' : ''
                  }`} />
                </button>

                {isStatusDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
                    {KANBAN_STATUSES.map((status) => (
                      <button
                        key={status.value}
                        onClick={() => handleStatusChange(status.value)}
                        className={`w-full flex items-center space-x-3 p-4 hover:bg-slate-50 transition-colors duration-200 ${
                          favoriteData.kanbanStatus === status.value ? 'bg-slate-50' : ''
                        }`}
                      >
                        <div className={`w-3 h-3 rounded-full bg-${status.color}-500`}></div>
                        <div className="text-left flex-1">
                          <div className="font-semibold text-slate-900">{status.label}</div>
                          <div className="text-xs text-slate-600">{status.description}</div>
                        </div>
                        {favoriteData.kanbanStatus === status.value && (
                          <CheckCircle2 className={`h-4 w-4 text-${status.color}-500`} />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Personal Rating */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700 flex items-center space-x-2">
                <Heart className="h-4 w-4 text-pink-500" />
                <span>My Rating</span>
              </label>
              
              <div className="relative">
                <button
                  onClick={() => setIsRatingDropdownOpen(!isRatingDropdownOpen)}
                  className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{currentRating?.emoji || '⚪'}</div>
                    <div className="text-left">
                      <div className="font-semibold text-slate-900">
                        {currentRating?.label || 'No rating'}
                      </div>
                    </div>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${
                    isRatingDropdownOpen ? 'rotate-180' : ''
                  }`} />
                </button>

                {isRatingDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
                    {ratingOptions.map((option) => (
                      <button
                        key={option.value || 'none'}
                        onClick={() => handlePersonalRatingChange(option.value)}
                        className={`w-full flex items-center space-x-3 p-4 hover:bg-slate-50 transition-colors duration-200 ${
                          favoriteData.personalRating === option.value ? 'bg-slate-50' : ''
                        }`}
                      >
                        <div className="text-2xl">{option.emoji}</div>
                        <div className="text-left flex-1">
                          <div className="font-semibold text-slate-900">{option.label}</div>
                        </div>
                        {favoriteData.personalRating === option.value && (
                          <CheckCircle2 className="h-4 w-4 text-pink-500" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Center Overview */}
          <div className="bg-gradient-to-r from-slate-50 to-slate-100/50 rounded-2xl p-6 border border-slate-200/50">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Center Overview</h3>
            
            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-slate-800 flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-slate-500" />
                  <span>Contact</span>
                </h4>
                <div className="space-y-3">
                  {center.center_contact.phone ? (
                    <a 
                      href={`tel:${formatPhoneForTel(center.center_contact.phone)}`}
                      className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-3 rounded-xl text-sm font-bold hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <Phone className="h-4 w-4" />
                      <span>{center.center_contact.phone}</span>
                    </a>
                  ) : (
                    <div className="text-slate-500 text-sm">No phone available</div>
                  )}
                  
                  {center.center_contact.website && (
                    <div>
                      <a 
                        href={center.center_contact.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium text-sm hover:underline"
                      >
                        <Link className="h-4 w-4" />
                        <span>Visit Website</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                  
                  <div>
                    <a 
                      href={center.center_listing_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 font-medium text-sm hover:underline"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>Toronto.ca Listing</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Languages and Dietary */}
              <div className="space-y-4">
                {center.languages_spoken.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-3 flex items-center space-x-2">
                      <Languages className="h-4 w-4 text-slate-500" />
                      <span>Languages</span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {center.languages_spoken.slice(0, 4).map((language, index) => (
                        <span key={index} className="bg-white px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 border border-slate-200">
                          {language}
                        </span>
                      ))}
                      {center.languages_spoken.length > 4 && (
                        <span className="bg-white px-3 py-1.5 rounded-lg text-sm font-medium text-slate-500 border border-slate-200">
                          +{center.languages_spoken.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {center.dietary_services.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-3 flex items-center space-x-2">
                      <Utensils className="h-4 w-4 text-slate-500" />
                      <span>Dietary Services</span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {center.dietary_services.slice(0, 4).map((service, index) => (
                        <span key={index} className="bg-white px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 border border-slate-200">
                          {service}
                        </span>
                      ))}
                      {center.dietary_services.length > 4 && (
                        <span className="bg-white px-3 py-1.5 rounded-lg text-sm font-medium text-slate-500 border border-slate-200">
                          +{center.dietary_services.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <FileText className="h-5 w-5 text-slate-500" />
              <span>My Notes</span>
            </h3>
            
            <div className="bg-slate-50 rounded-xl p-1">
              <textarea
                value={notesValue}
                onChange={handleNotesChange}
                placeholder="Add your thoughts, questions, or important details about this center..."
                className="w-full p-4 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all duration-200 min-h-[120px]"
                rows={6}
              />
            </div>
          </div>

          {/* File Attachments */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <Upload className="h-5 w-5 text-slate-500" />
                <span>Attachments</span>
              </h3>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Add Files
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
              <div className="space-y-3">
                {favoriteData.attachments.map((attachment) => (
                  <div key={attachment.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:shadow-sm transition-all duration-200">
                    <div className="flex items-center space-x-3">
                      <div className="p-2.5 bg-slate-100 rounded-lg">
                        <FileText className="h-4 w-4 text-slate-500" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{attachment.name}</div>
                        <div className="text-xs text-slate-500">
                          {formatFileSize(attachment.size)} • {new Date(attachment.uploadedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveAttachment(attachment.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                <Upload className="h-8 w-8 text-slate-400 mx-auto mb-3" />
                <p className="text-sm font-medium text-slate-600">No files attached yet</p>
                <p className="text-xs text-slate-400 mt-1">Click "Add Files" to upload documents, photos, or notes</p>
              </div>
            )}
          </div>

          {/* City Support Notes */}
          {center.city_support_notes && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-3 flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>City Support Notes</span>
              </h4>
              <p className="text-sm text-blue-800 leading-relaxed">{center.city_support_notes}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};