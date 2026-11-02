import { ExternalLink, Heart, MapPin, Phone, Star } from 'lucide-react';
import { Center } from '../types/center';
import { useFavorites } from '../hooks/useFavorites';

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
  const ratings = center.programs
    .map(program => program.quality_rating)
    .filter((rating): rating is number => typeof rating === 'number' && Number.isFinite(rating));
  const avgRating = ratings.length ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length : null;
  const ageGroups = [...new Set(center.programs.map(program => program.age_group).filter(Boolean))];
  const actionClass = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#d4e3d8] bg-white px-4 py-2 text-sm font-semibold text-[#175d3e] hover:bg-[#edf5ed]';

  return (
    <article className="text-[#203c2c]">
      <div className="px-5 pb-4 pt-1">
        <h2 className="break-words text-[22px] font-semibold leading-tight tracking-[-0.025em] text-[#17392a]">{center.center_name}</h2>
        <p className="mt-2 flex items-start gap-2 text-sm leading-relaxed text-[#607267]">
          <MapPin size={17} className="mt-0.5 shrink-0 text-[#688b73]" aria-hidden="true" />
          <span className="min-w-0 break-words">{center.location.address}{center.location.postal_code ? `, ${center.location.postal_code}` : ''}</span>
        </p>
      </div>

      <section className="border-t border-[#e4ece4] px-5 py-4" aria-label="Programs">
        <h3 className="text-sm font-semibold text-[#284a36]">Programs</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-[#53685a]">{ageGroups.length ? ageGroups.join(' · ') : 'Programs not listed'}</p>
      </section>

      <section className="border-t border-[#e4ece4] px-5 py-4" aria-label="Funding and quality">
        <h3 className="text-sm font-semibold text-[#284a36]">Funding and quality</h3>
        <div className="mt-2 flex flex-wrap gap-2 text-xs font-medium text-[#53685a]">
          {center.CWELCC_participant === true && <span className="rounded-full bg-[#f2f4ee] px-3 py-1.5">CWELCC</span>}
          {center.subsidy_available === true && <span className="rounded-full bg-[#f2f4ee] px-3 py-1.5">Subsidy available</span>}
          <span className="inline-flex items-center gap-1 rounded-full bg-[#f2f4ee] px-3 py-1.5"><Star size={13} aria-hidden="true" /> {avgRating === null ? 'Quality rating unavailable' : `Quality rating: ${avgRating.toFixed(1)}`}</span>
        </div>
      </section>

      <section className="border-t border-[#e4ece4] px-5 py-4" aria-label="Centre actions">
        <div className="flex flex-wrap gap-2">
          {center.center_contact.phone ? (
            <a href={`tel:${formatPhoneForTel(center.center_contact.phone)}`} aria-label={`Call ${center.center_name} at ${center.center_contact.phone}`} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#175d3e] px-5 py-2 text-sm font-semibold text-white hover:bg-[#124b33]">
              <Phone size={16} aria-hidden="true" /> Call
            </a>
          ) : <span className="inline-flex min-h-11 items-center rounded-full bg-[#f2f4ee] px-4 py-2 text-sm text-[#68786d]">Call unavailable</span>}
          <button type="button" onClick={() => toggleFavorite(center.center_id)} aria-pressed={saved} className={actionClass}>
            <Heart size={16} fill={saved ? 'currentColor' : 'none'} aria-hidden="true" /> {saved ? 'Saved' : 'Save'}
          </button>
          <a href={center.center_listing_url} target="_blank" rel="noopener noreferrer" className={actionClass}>
            View City listing <ExternalLink size={15} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
        {center.center_contact.website && <a href={center.center_contact.website} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#175d3e] underline-offset-2 hover:underline">Website <ExternalLink size={14} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>}
      </section>
    </article>
  );
};
