import { useEffect, useRef, useState } from 'react';
import { Check, Copy, ExternalLink, Globe, Heart, MapPin, Phone } from 'lucide-react';
import { Center } from '../types/center';
import { useFavorites } from '../hooks/useFavorites';
import { foodOptions, matchesFoodOption } from '../utils/foodOptions';

interface CenterCardProps {
  center: Center;
}

const formatPhoneForTel = (phone: string) => {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  return `+1${digits}`;
};

export const CenterCard: React.FC<CenterCardProps> = ({ center }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const saved = isFavorite(center.center_id);
  const [copyStatus, setCopyStatus] = useState<{ field: 'address' | 'phone'; message: string; success: boolean } | null>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ageGroups = [...new Set(center.programs.map(program => program.age_group).filter(Boolean))];
  const listedFoodOptions = foodOptions.filter(option => matchesFoodOption(center.dietary_services, option.value));
  const address = `${center.location.address}${center.location.postal_code ? `, ${center.location.postal_code}` : ''}`;
  const phone = center.center_contact.phone?.trim();
  const buttonClass = 'inline-flex min-h-11 min-w-0 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#175d3e]';
  const linkClass = 'inline-flex items-center gap-1 font-semibold text-[#175d3e] underline underline-offset-4 hover:text-[#124b33]';

  useEffect(() => () => {
    if (copyTimer.current) clearTimeout(copyTimer.current);
  }, []);

  const copyValue = async (field: 'address' | 'phone', value: string) => {
    if (copyTimer.current) clearTimeout(copyTimer.current);
    try {
      await navigator.clipboard.writeText(value);
      setCopyStatus({ field, message: `${field === 'address' ? 'Address' : 'Phone number'} copied`, success: true });
    } catch {
      setCopyStatus({ field, message: 'Could not copy. Select the text to copy it.', success: false });
    }
    copyTimer.current = setTimeout(() => setCopyStatus(null), 2500);
  };

  const copyButton = (field: 'address' | 'phone', value: string) => (
    <button type="button" onClick={() => void copyValue(field, value)} aria-label={`Copy ${field === 'phone' ? 'phone number' : 'address'}`} title={`Copy ${field === 'phone' ? 'phone number' : 'address'}`} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[#175d3e] hover:bg-[#edf5ed] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#175d3e]">
      {copyStatus?.field === field && copyStatus.success ? <Check size={17} aria-hidden="true" /> : <Copy size={17} aria-hidden="true" />}
    </button>
  );

  return (
    <article className="text-[#203c2c]">
      <div className="px-5 pb-4 pt-1 sm:px-6">
        <h2 className="break-words text-[22px] font-semibold leading-tight tracking-[-0.025em] text-[#17392a]">{center.center_name}</h2>
        <div className="mt-3 flex items-start gap-2 text-base leading-relaxed text-[#53685a]">
          <MapPin size={17} className="mt-3 shrink-0 text-[#688b73]" aria-hidden="true" />
          <span className="min-w-0 flex-1 break-words py-2.5">{address}</span>
          {copyButton('address', address)}
        </div>
        {phone && (
          <div className="flex items-center gap-2 text-sm">
            <Phone size={17} className="shrink-0 text-[#688b73]" aria-hidden="true" />
            <a href={`tel:${formatPhoneForTel(phone)}`} className={`${linkClass} min-w-0 flex-1 break-words`}>{phone}</a>
            {copyButton('phone', phone)}
          </div>
        )}
        {center.center_contact.website && (
          <div className="mt-2 flex items-center gap-2 text-sm">
            <Globe size={17} className="shrink-0 text-[#688b73]" aria-hidden="true" />
            <a href={center.center_contact.website} target="_blank" rel="noopener noreferrer" className={linkClass}>Centre website <ExternalLink size={14} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>
          </div>
        )}
        <p role="status" aria-live="polite" className={copyStatus ? 'mt-2 text-xs text-[#53685a]' : 'sr-only'}>{copyStatus?.message || ''}</p>
      </div>

      <section className="border-t border-[#e4ece4] px-5 py-4 sm:px-6" aria-label="Programs">
        <h3 className="text-sm font-semibold text-[#284a36]">Programs</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-[#53685a]">{ageGroups.length ? ageGroups.join(' · ') : 'Programs not listed'}</p>
      </section>

      <section className="border-t border-[#e4ece4] px-5 py-4 sm:px-6" aria-label="Food options">
        <h3 className="text-sm font-semibold text-[#284a36]">Food options</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-[#53685a]">{listedFoodOptions.length ? listedFoodOptions.map(option => option.label).join(' · ') : 'No food options listed'}</p>
        {listedFoodOptions.length > 0 && <p className="mt-1 text-sm text-[#53685a]">Confirm details with the centre</p>}
      </section>

      <section className="border-t border-[#e4ece4] px-5 py-4 sm:px-6" aria-label="Centre actions">
        <div className="grid grid-cols-2 gap-2">
          {phone ? (
            <a href={`tel:${formatPhoneForTel(phone)}`} aria-label={`Call ${center.center_name} at ${phone}`} className={`${buttonClass} bg-[#175d3e] text-white hover:bg-[#124b33]`}><Phone size={16} aria-hidden="true" /> Call</a>
          ) : <span className={`${buttonClass} bg-[#f2f4ee] text-[#68786d]`}>Call unavailable</span>}
          <button type="button" onClick={() => toggleFavorite(center.center_id)} aria-pressed={saved} className={`${buttonClass} border border-[#d4e3d8] bg-white text-[#175d3e] hover:bg-[#edf5ed]`}><Heart size={16} fill={saved ? 'currentColor' : 'none'} aria-hidden="true" /> {saved ? 'Saved' : 'Save'}</button>
        </div>
        <a href={center.center_listing_url} target="_blank" rel="noopener noreferrer" className={`${linkClass} mt-4 text-sm`}>More details on Toronto.ca <ExternalLink size={14} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>
      </section>
    </article>
  );
};
