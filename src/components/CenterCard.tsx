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
      className={`rounded-xl border p-4 transition-colors ${
        isSelected
          ? 'border-[#537d63] bg-[#f2f6f0] shadow-sm'
          : 'border-[#e7e3da] bg-white hover:border-[#c9d5ca]'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="font-semibold leading-snug text-[#20352d]">{center.center_name}</h4>
          <p className="mt-1.5 flex items-start gap-1.5 text-xs leading-relaxed text-slate-600">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#7b8a7f]" />
            <span>{center.location.address}{center.location.postal_code ? `, ${center.location.postal_code}` : ''}</span>
          </p>
        </div>
        <button
          type="button"
          aria-pressed={isSelected}
          onClick={onSelect}
          className={`shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors ${
            isSelected ? 'bg-[#214f40] text-white' : 'bg-[#edf3ed] text-[#214f40] hover:bg-[#e2ece3]'
          }`}
        >
          {isSelected ? 'On map' : 'Show on map'}
        </button>
      </div>

      <div className="mt-3">
        {tags.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {tags.map(tag => (
              <span key={tag} className="rounded-md bg-[#edf3ed] px-2.5 py-1 text-xs font-semibold text-[#244f3b]">
                {tag}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500">No halal-related tag in the City listing.</p>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {ageGroups.slice(0, 3).map(age => (
          <span key={age} className="rounded-md bg-[#f3f1ea] px-2.5 py-1 text-[11px] font-medium text-slate-700">{age}</span>
        ))}
        {ageGroups.length > 3 && <span className="text-[11px] text-slate-500">+{ageGroups.length - 3} age groups</span>}
        {center.CWELCC_participant && <span className="rounded-md bg-[#f3f1ea] px-2.5 py-1 text-[11px] font-medium text-slate-700">CWELCC</span>}
        {center.subsidy_available && <span className="rounded-md bg-[#f3f1ea] px-2.5 py-1 text-[11px] font-medium text-slate-700">Fee subsidy</span>}
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 border-t border-[#eeece5] pt-3">
        <span className="text-[11px] text-slate-500">City listing · {center.last_updated.replace(/\.$/, '')}</span>
        <div className="flex shrink-0 items-center gap-3">
          {center.center_contact.phone && (
            <a
              href={`tel:${formatPhoneForTel(center.center_contact.phone)}`}
              aria-label={`Call ${center.center_name}`}
              className="text-[#315d48] hover:text-[#173d30]"
            >
              <Phone className="h-4 w-4" />
            </a>
          )}
          <a
            href={center.center_listing_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#315d48] underline underline-offset-2"
          >
            Source listing <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </article>
  );
};