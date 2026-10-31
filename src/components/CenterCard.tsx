import React from 'react';
import { ExternalLink, MapPin, Phone, Utensils } from 'lucide-react';
import { Center } from '../types/center';

interface CenterCardProps {
  center: Center;
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

export const CenterCard: React.FC<CenterCardProps> = ({ center }) => {
  const tags = halalLabels(center);
  const ageGroups = [...new Set(center.programs.map(program => program.age_group))];

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold leading-snug text-slate-900">{center.center_name}</h3>
          <p className="mt-2 flex items-start gap-2 text-sm leading-relaxed text-slate-600">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
            <span>{center.location.address}{center.location.postal_code ? `, ${center.location.postal_code}` : ''}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {center.CWELCC_participant && <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">CWELCC</span>}
          {center.subsidy_available && <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">Fee subsidy</span>}
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
        <h4 className="flex items-center gap-2 text-sm font-semibold text-emerald-950">
          <Utensils className="h-4 w-4" />
          Halal information in City listing
        </h4>
        {tags.length > 0 ? (
          <ul className="mt-2 flex flex-wrap gap-2">
            {tags.map(tag => (
              <li key={tag} className="rounded-full bg-white px-3 py-1 text-sm font-medium text-emerald-900">
                {tag}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-slate-700">No halal-related tag appears in the City listing.</p>
        )}
        <p className="mt-2 text-xs leading-relaxed text-slate-600">
          Listing information is not a halal certification. Confirm the centre’s current food practices directly.
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {ageGroups.map(age => (
          <span key={age} className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-900">{age}</span>
        ))}
      </div>

      <p className="mt-3 text-xs text-slate-500">
        City listing updated {center.last_updated}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
        {center.center_contact.phone && (
          <a href={`tel:${formatPhoneForTel(center.center_contact.phone)}`} className="inline-flex items-center gap-2 rounded-lg bg-emerald-800 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-900">
            <Phone className="h-4 w-4" />
            {center.center_contact.phone}
          </a>
        )}
        {center.center_contact.website && (
          <a href={center.center_contact.website} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-emerald-800 underline underline-offset-2">
            Website
          </a>
        )}
        <a href={center.center_listing_url} target="_blank" rel="noopener noreferrer" className="ml-auto inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 underline underline-offset-2">
          City of Toronto listing <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </article>
  );
};