import React, { useState, useRef } from 'react';
import { X, MapPin, Star, Phone, ExternalLink, Languages, Utensils, Link, Upload, Download, Trash2, FileText, Image, File } from 'lucide-react';
import { Center } from '../types/center';

interface AttachedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
}

interface CenterDetailSidepanelProps {
  center: Center | null;
  isOpen: boolean;
  onClose: () => void;
  notes: string;
  onNotesChange: (notes: string) => void;
  preferenceRating: string;
  onPreferenceRatingChange: (rating: string) => void;
  attachedFiles: AttachedFile[];
  onFileUpload: (files: FileList) => void;
  onFileDelete: (fileId: string) => void;
}

export const CenterDetailSidepanel: React.FC<CenterDetailSidepanelProps> = ({
  center,
  isOpen,
  onClose,
  notes,
  onNotesChange,
  preferenceRating,
  onPreferenceRatingChange,
  attachedFiles,
  onFileUpload,
  onFileDelete
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'notes' | 'files'>('details');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  if (!center) return null;

  const programsWithRating = center.programs.filter(p => p.quality_rating);
  const avgRating = programsWithRating.length > 0 
    ? programsWithRating.reduce((sum, p) => sum + (p.quality_rating || 0), 0) / programsWithRating.length
    : null;

  const formatAddress = () => {
    const baseAddress = center.location.address;
    const postalCode = center.location.postal_code;
    return postalCode ? `${baseAddress}, ${postalCode}` : baseAddress;
  };

  const formatPhoneForTel = (phone: string | null | undefined) => {
    if (!phone || typeof phone !== 'string') return '';
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 10) return `+1${digits}`;
    if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
    return `+1${digits}`;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFileUpload(e.target.files);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (type === 'application/pdf') return <FileText className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const applyFormatting = (format: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = notes.substring(start, end);
    
    let formattedText = '';
    let newCursorPos = start;

    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        newCursorPos = start + (selectedText ? 2 : 2);
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        newCursorPos = start + (selectedText ? 1 : 1);
        break;
      case 'bullet':
        formattedText = `\n• ${selectedText}`;
        newCursorPos = start + 3;
        break;
      case 'number':
        formattedText = `\n1. ${selectedText}`;
        newCursorPos = start + 4;
        break;
    }

    const newNotes = notes.substring(0, start) + formattedText + notes.substring(end);
    onNotesChange(newNotes);

    // Set cursor position after state update
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidepanel */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-2xl z-[201] transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex-shrink-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1 pr-4">
                <h2 className="text-xl font-bold leading-tight mb-2">{center.center_name}</h2>
                <div className="flex items-start text-sm opacity-90">
                  <MapPin className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{formatAddress()}</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors duration-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Preference Rating */}
            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">My Rating</label>
              <select
                value={preferenceRating}
                onChange={(e) => onPreferenceRatingChange(e.target.value)}
                className="bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                <option value="" className="text-slate-800">Not Set</option>
                <option value="good" className="text-slate-800">🙂 Good</option>
                <option value="great" className="text-slate-800">😄 Great</option>
                <option value="excellent" className="text-slate-800">😍 Excellent</option>
              </select>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex-shrink-0 border-b border-slate-200">
            <div className="flex">
              {[
                { id: 'details', label: 'Details', icon: MapPin },
                { id: 'notes', label: 'Notes', icon: FileText },
                { id: 'files', label: 'Files', icon: Upload }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors duration-200 ${
                    activeTab === id
                      ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50'
                      : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                  {id === 'files' && attachedFiles.length > 0 && (
                    <span className="bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full text-xs font-bold">
                      {attachedFiles.length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'details' && (
              <div className="p-6 space-y-6">
                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    {center.center_contact.phone && (
                      <div className="flex items-center space-x-3">
                        <Phone className="h-5 w-5 text-slate-400" />
                        <a 
                          href={`tel:${formatPhoneForTel(center.center_contact.phone)}`}
                          className="text-indigo-600 hover:underline font-medium"
                        >
                          {center.center_contact.phone}
                        </a>
                      </div>
                    )}
                    {center.center_contact.website && (
                      <div className="flex items-center space-x-3">
                        <Link className="h-5 w-5 text-slate-400" />
                        <a 
                          href={center.center_contact.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:underline font-medium"
                        >
                          Visit Website
                        </a>
                      </div>
                    )}
                    <div className="flex items-center space-x-3">
                      <ExternalLink className="h-5 w-5 text-slate-400" />
                      <a 
                        href={center.center_listing_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:underline font-medium"
                      >
                        Toronto.ca Listing
                      </a>
                    </div>
                  </div>
                </div>

                {/* Programs & Rating */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Programs & Quality</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Star className={`h-5 w-5 ${avgRating ? 'text-amber-400 fill-current' : 'text-slate-400'}`} />
                      <span className="font-medium">
                        Quality Rating: {avgRating ? avgRating.toFixed(1) : 'Not Available'}
                      </span>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-4">
                      <h4 className="font-medium text-slate-700 mb-2">Available Programs:</h4>
                      <div className="space-y-2">
                        {center.programs.map((program, index) => (
                          <div key={index} className="flex justify-between items-center text-sm">
                            <span className="text-slate-600">{program.age_group}</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-slate-500">Capacity: {program.capacity}</span>
                              {program.vacancy && (
                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                                  {program.vacancy}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Services */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Services & Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className={`w-3 h-3 rounded-full ${center.CWELCC_participant ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                        <span className="font-medium text-slate-700">CWELCC Participant</span>
                      </div>
                      <p className="text-sm text-slate-600">
                        {center.CWELCC_participant ? 'Yes' : 'No'}
                      </p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className={`w-3 h-3 rounded-full ${center.subsidy_available ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                        <span className="font-medium text-slate-700">Subsidy Available</span>
                      </div>
                      <p className="text-sm text-slate-600">
                        {center.subsidy_available ? 'Yes' : 'No'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Languages */}
                {center.languages_spoken.length > 0 && (
                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      <Languages className="h-5 w-5 text-slate-400" />
                      <h3 className="text-lg font-semibold text-slate-800">Languages Spoken</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {center.languages_spoken.map((language, index) => (
                        <span key={index} className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
                          {language}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dietary Services */}
                {center.dietary_services.length > 0 && (
                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      <Utensils className="h-5 w-5 text-slate-400" />
                      <h3 className="text-lg font-semibold text-slate-800">Dietary Services</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {center.dietary_services.map((service, index) => (
                        <span key={index} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="p-6">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-slate-800">My Notes</h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => applyFormatting('bold')}
                        className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors duration-200"
                        title="Bold"
                      >
                        <span className="font-bold text-sm">B</span>
                      </button>
                      <button
                        onClick={() => applyFormatting('italic')}
                        className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors duration-200"
                        title="Italic"
                      >
                        <span className="italic text-sm">I</span>
                      </button>
                      <button
                        onClick={() => applyFormatting('bullet')}
                        className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors duration-200"
                        title="Bullet List"
                      >
                        <span className="text-sm">•</span>
                      </button>
                      <button
                        onClick={() => applyFormatting('number')}
                        className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors duration-200"
                        title="Numbered List"
                      >
                        <span className="text-sm">1.</span>
                      </button>
                    </div>
                  </div>
                  <textarea
                    ref={textareaRef}
                    value={notes}
                    onChange={(e) => onNotesChange(e.target.value)}
                    placeholder="Add your thoughts, questions, or important details about this center..."
                    className="w-full h-96 p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  />
                  <p className="text-xs text-slate-500 mt-2">
                    Use **bold**, *italic*, • bullets, or 1. numbered lists. Auto-saves as you type.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'files' && (
              <div className="p-6">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-800">Attached Files</h3>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors duration-200 flex items-center space-x-2"
                    >
                      <Upload className="h-4 w-4" />
                      <span>Upload Files</span>
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

                  {attachedFiles.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
                      <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-600 mb-2">No files attached yet</p>
                      <p className="text-sm text-slate-500">Upload images, documents, or PDFs</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {attachedFiles.map((file) => (
                        <div key={file.id} className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg">
                          <div className="flex-shrink-0 text-slate-400">
                            {getFileIcon(file.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-800 truncate">{file.name}</p>
                            <p className="text-xs text-slate-500">
                              {formatFileSize(file.size)} • {new Date(file.uploadedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => window.open(file.url, '_blank')}
                              className="p-2 text-slate-400 hover:text-indigo-600 transition-colors duration-200"
                              title="Download"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => onFileDelete(file.id)}
                              className="p-2 text-slate-400 hover:text-red-600 transition-colors duration-200"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};