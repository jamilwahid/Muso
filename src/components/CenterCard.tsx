import React from 'react';
import { ExternalLink, MapPin, Phone } from 'lucide-react';
import { Center } from '../types/center';

interface CenterCardProps {
  center: Center;
  isSelected: boolean;
  onSelect: () => void;
}

const halalLabels = (center: Center) =>
  center.dietary_services.filter(service => /halal/i.test(service));

const formatPhoneForTel = (phone: string | null | undefined) => {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  return digits ? `+1${digits}` : '';
};

export const CenterCard: React.FC<CenterCardProps> = ({ center, isSelected, onSelect }) => {
  const tags = halalLabels(center);
  const ageGroups = [...new Set(center.programs.map(program => program.age_group))];

  return (
    <article
      id={`center-${center.center_id}`}
      className={`rounded-2xl border p-4 transition-all duration-150 ${
        isSelected
          ? 'border-[#75a487] bg-[#eff6ed] shadow-[0_3px_12px_rgba(23,96,68,0.08)]'
          : 'border-[#e5e1d7] bg-[#fffefa] hover:border-[#b9cdbb] hover:shadow-[0_3px_12px_rgba(32,43,36,0.05)]'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="font-semibold leading-snug text-[#202b24]">{center.center_name}</h4>
          <p className="mt-1.5 flex items-start gap-1.5 text-xs leading-relaxed text-[#606b62]">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#7f8d7f]" />
            <span>{center.location.address}{center.location.postal_code ? `, ${center.location.postal_code}` : ''}</span>
          </p>
        </div>
        <button
          type="button"
          aria-pressed={isSelected}
          onClick={onSelect}
          className={`shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors ${
            isSelected ? 'bg-[#176044] text-white' : 'bg-[#e8f3e9] text-[#176044] hover:bg-[#dcebdd]'
          }`}
        >
          {isSelected ? 'On map' : 'Show on map'}
        </button>
      </div>

      <div className="mt-3">
        {tags.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {tags.map(tag => (
              <span key={tag} className="rounded-full border border-[#d8e8d8] bg-[#eaf4e9] px-3 py-1 text-xs font-semibold text-[#20573d]">
                {tag}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#737d73]">No halal-related tag in the City listing.</p>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {ageGroups.slice(0, 3).map(age => (
          <span key={age} className="rounded-full bg-[#f9eee6] px-2.5 py-1 text-[11px] font-medium text-[#8e5036]">{age}</span>
        ))}
        {ageGroups.length > 3 && <span className="text-[11px] text-[#737d73]">+{ageGroups.length - 3} age groups</span>}
        {center.CWELCC_participant && <span className="rounded-md bg-[#f3f1ea] px-2.5 py-1 text-[11px] font-medium text-slate-700">CWELCC</span>}
        {center.subsidy_available && <span className="rounded-md bg-[#f3f1ea] px-2.5 py-1 text-[11px] font-medium text-slate-700">Fee subsidy</span>}
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 border-t border-[#eee9df] pt-3">
        <span className="text-[11px] text-slate-500">City listing · {center.last_updated.replace(/\.$/, '')}</span>
        <div className="flex shrink-0 items-center gap-3">
          {center.center_contact.phone && (
            <a
              href={`tel:${formatPhoneForTel(center.center_contact.phone)}`}
              aria-label={`Call ${center.center_name}`}
              className="text-[#176044] hover:text-[#124b36]"
            >
              <Phone className="h-4 w-4" />
            </a>
          )}
          <a
            href={center.center_listing_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#176044] underline decoration-[#a9c9ad] underline-offset-2 hover:text-[#124b36]"
          >
            Source listing <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </article>
  );
};