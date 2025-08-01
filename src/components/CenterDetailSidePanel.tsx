import React, { useState, useRef } from 'react';
import { X, MapPin, Star, Phone, ExternalLink, Languages, Utensils, Link, Heart, Clock, CheckCircle2, Phone as PhoneIcon, Eye, FileText, Upload, Trash2, Bold, Italic, List, Link2 } from 'lucide-react';
import { Center, FavoriteCenterData } from '../types/center';
import { useFavorites } from '../contexts/FavoritesContext';

interface CenterDetailSidePanelProps {
  center: Center;
  favoriteData: FavoriteCenterData;
  isOpen: boolean;
  onClose: () => void;
}

export const CenterDetailSidePanel: React.FC<CenterDetailSidePanelProps> = ({
  center,
  favoriteData,
  isOpen,
  onClose
}) => {
  const { toggleAction, updateNotes, updatePersonalRating, addAttachment, removeAttachment } = useFavorites();
  const [notesValue, setNotesValue] = useState(favoriteData.notes);
  const [isNotesExpanded, setIsNotesExpanded] = useState(false);
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
    updatePersonalRating(center.center_id, rating);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      // Create a mock attachment object (in a real app, you'd upload to a server)
      const attachment = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file), // In production, this would be a server URL
        uploadedAt: new Date().toISOString()
      };
      
      addAttachment(center.center_id, attachment);
    });

    // Clear the input
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

  const actionItems = [
    { key: 'called' as const, label: 'Called', icon: PhoneIcon, color: 'emerald' },
    { key: 'visited' as const, label: 'Visited', icon: Eye, color: 'blue' },
    { key: 'applied' as const, label: 'Applied', icon: FileText, color: 'purple' }
  ];

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
        <div className="sticky top-0 bg-white/95 backdrop-blur-xl border-b border-slate-200 p-6 z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-4">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">{center.center_name}</h2>
              <div className="flex items-start text-sm text-slate-500">
                <MapPin className="h-4 w-4 mr-2 text-slate-400 flex-shrink-0 mt-0.5" />
                <span className="font-medium leading-relaxed">{formatAddress()}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors duration-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Personal Rating Section */}
          <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-6 border border-pink-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center space-x-2">
              <Heart className="h-5 w-5 text-pink-500" />
              <span>My Personal Rating</span>
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {ratingOptions.map((option) => (
                <button
                  key={option.value || 'none'}
                  onClick={() => handlePersonalRatingChange(option.value)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-center ${
                    favoriteData.personalRating === option.value
                      ? 'border-pink-300 bg-pink-100 shadow-md'
                      : 'border-slate-200 bg-white hover:border-pink-200 hover:bg-pink-50'
                  }`}
                >
                  <div className="text-2xl mb-2">{option.emoji}</div>
                  <div className="text-sm font-medium text-slate-700">{option.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Center Details */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-800">Center Details</h3>
            
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              {center.CWELCC_participant && (
                <div className="inline-flex items-center bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 px-3 py-2 rounded-lg text-sm font-medium border border-purple-200/60">
                  CWELCC Participant
                </div>
              )}
              
              {center.subsidy_available && (
                <div className="inline-flex items-center bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 px-3 py-2 rounded-lg text-sm font-medium border border-purple-200/60">
                  Subsidy Available
                </div>
              )}

              <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 px-3 py-2 rounded-lg text-sm font-medium border border-purple-200/60">
                <Star className={`h-4 w-4 ${
                  avgRating 
                    ? 'text-amber-400 fill-current' 
                    : 'text-slate-400'
                }`} />
                <span>
                  {avgRating ? `${avgRating.toFixed(1)} Rating` : 'No Rating'}
                </span>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-slate-50 rounded-xl p-4">
              <h4 className="font-semibold text-slate-800 mb-3">Contact Information</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-slate-500" />
                  {center.center_contact.phone ? (
                    <a 
                      href={`tel:${formatPhoneForTel(center.center_contact.phone)}`}
                      className="text-emerald-600 hover:underline font-medium"
                    >
                      {center.center_contact.phone}
                    </a>
                  ) : (
                    <span className="text-slate-500">No phone available</span>
                  )}
                </div>
                
                {center.center_contact.website && (
                  <div className="flex items-center space-x-3">
                    <Link className="h-4 w-4 text-slate-500" />
                    <a 
                      href={center.center_contact.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
                
                <div className="flex items-center space-x-3">
                  <ExternalLink className="h-4 w-4 text-slate-500" />
                  <a 
                    href={center.center_listing_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:underline"
                  >
                    Toronto.ca Listing
                  </a>
                </div>
              </div>
            </div>

            {/* Programs */}
            <div className="bg-slate-50 rounded-xl p-4">
              <h4 className="font-semibold text-slate-800 mb-3">Programs Offered</h4>
              <div className="space-y-2">
                {center.programs.map((program, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div>
                      <div className="font-medium text-slate-800">{program.age_group}</div>
                      <div className="text-sm text-slate-500">Capacity: {program.capacity}</div>
                    </div>
                    <div className="text-right">
                      {program.vacancy && (
                        <div className="text-sm font-medium text-emerald-600">{program.vacancy}</div>
                      )}
                      {program.quality_rating && (
                        <div className="flex items-center space-x-1 text-sm text-slate-600">
                          <Star className="h-3 w-3 text-amber-400 fill-current" />
                          <span>{program.quality_rating}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Languages and Dietary Services */}
            {(center.languages_spoken.length > 0 || center.dietary_services.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {center.languages_spoken.length > 0 && (
                  <div className="bg-slate-50 rounded-xl p-4">
                    <h4 className="font-semibold text-slate-800 mb-3 flex items-center space-x-2">
                      <Languages className="h-4 w-4 text-slate-500" />
                      <span>Languages Spoken</span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {center.languages_spoken.map((language, index) => (
                        <span key={index} className="bg-white px-3 py-1 rounded-lg text-sm font-medium text-slate-700">
                          {language}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {center.dietary_services.length > 0 && (
                  <div className="bg-slate-50 rounded-xl p-4">
                    <h4 className="font-semibold text-slate-800 mb-3 flex items-center space-x-2">
                      <Utensils className="h-4 w-4 text-slate-500" />
                      <span>Dietary Services</span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {center.dietary_services.map((service, index) => (
                        <span key={index} className="bg-white px-3 py-1 rounded-lg text-sm font-medium text-slate-700">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Progress Tracking */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center space-x-2">
              <CheckCircle2 className="h-5 w-5 text-slate-500" />
              <span>Progress Tracking</span>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {actionItems.map(({ key, label, icon: Icon, color }) => {
                const isCompleted = favoriteData.actions[key];
                return (
                  <button
                    key={key}
                    onClick={() => toggleAction(center.center_id, key)}
                    className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all duration-200 ${
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
                      <div className="font-medium">{label}</div>
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
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center space-x-2">
              <FileText className="h-5 w-5 text-slate-500" />
              <span>My Notes</span>
            </h3>
            
            <div className="bg-slate-50 rounded-xl p-4">
              <textarea
                value={notesValue}
                onChange={handleNotesChange}
                placeholder="Add your thoughts, questions, or important details about this center..."
                className="w-full p-4 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none transition-all duration-200"
                rows={6}
              />
            </div>
          </div>

          {/* File Attachments */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800 flex items-center space-x-2">
                <Upload className="h-5 w-5 text-slate-500" />
                <span>Attachments</span>
              </h3>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:from-indigo-600 hover:to-purple-700 transition-all duration-200"
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
              <div className="space-y-2">
                {favoriteData.attachments.map((attachment) => (
                  <div key={attachment.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-slate-100 rounded-lg">
                        <FileText className="h-4 w-4 text-slate-500" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-800">{attachment.name}</div>
                        <div className="text-xs text-slate-500">
                          {formatFileSize(attachment.size)} • {new Date(attachment.uploadedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveAttachment(attachment.id)}
                      className="p-2 text-slate-400 hover:text-red-500 transition-colors duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-500">No files attached yet</p>
                <p className="text-xs text-slate-400 mt-1">Click "Add Files" to upload documents, photos, or notes</p>
              </div>
            )}
          </div>

          {/* City Support Notes */}
          {center.city_support_notes && (
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">City Support Notes</h4>
              <p className="text-sm text-blue-700 leading-relaxed">{center.city_support_notes}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};