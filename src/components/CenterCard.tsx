import { ExternalLink, Heart, MapPin, Phone, Star, Utensils } from 'lucide-react';
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
  const ratings = center.programs.filter(program => program.quality_rating);
  const avgRating = ratings.length
    ? ratings.reduce((sum, program) => sum + (program.quality_rating || 0), 0) / ratings.length
    : null;
  const foodOptions = [...center.dietary_services].sort(
    (a, b) => Number(/halal/i.test(b)) - Number(/halal/i.test(a))
  );
  const ageGroups = [...new Set(center.programs.map(program => program.age_group))];
  const actionClass = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#d4e3d8] bg-white px-4 py-2 text-sm font-semibold text-[#175d3e] hover:bg-[#edf5ed]';

  return (
    <article className="text-[#203c2c]">
      <div className="px-5 pb-5 pt-1">
        <h2 className="pr-8 text-[22px] font-semibold leading-tight tracking-[-0.025em] text-[#17392a]">{center.center_name}</h2>
        <p className="mt-2 flex items-start gap-2 text-sm leading-relaxed text-[#607267]">
          <MapPin size={17} className="mt-0.5 shrink-0 text-[#688b73]" aria-hidden="true" />
          <span>{center.location.address}{center.location.postal_code ? `, ${center.location.postal_code}` : ''}</span>
        </p>
      </div>

      <section className="border-t border-[#e4ece4] px-5 py-4" aria-label="Food options">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-[#175d3e]"><Utensils size={16} /> Food options</h3>
        {foodOptions.length ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {foodOptions.map(option => (
              <span key={option} className={`rounded-full px-3 py-1.5 text-xs font-medium ${/halal/i.test(option) ? 'bg-[#e0f1e4] text-[#175d3e]' : 'bg-[#f2f4ee] text-[#536458]'}`}>
                {option}
              </span>
            ))}
          </div>
        ) : <p className="mt-2 text-sm text-[#68786d]">No food options listed.</p>}
        <p className="mt-3 text-xs leading-relaxed text-[#718075]">From the City listing. Confirm current food practices with the centre.</p>
      </section>

      <div className="flex flex-wrap gap-2 border-t border-[#e4ece4] px-5 py-4">
        {center.center_contact.phone ? (
          <a href={`tel:${formatPhoneForTel(center.center_contact.phone)}`} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#175d3e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#124b33]">
            <Phone size={16} /> {center.center_contact.phone}
          </a>
        ) : (
          <span className="inline-flex min-h-11 items-center rounded-full bg-[#f2f4ee] px-4 py-2 text-sm text-[#68786d]">No phone</span>
        )}
        <button type="button" onClick={() => toggleFavorite(center.center_id)} aria-pressed={saved} className={actionClass}>
          <Heart size={16} fill={saved ? 'currentColor' : 'none'} /> {saved ? 'Saved' : 'Save'}
        </button>
      </div>

      <div className="space-y-4 border-t border-[#e4ece4] px-5 py-4 text-sm text-[#53685a]">
        {ageGroups.length > 0 && <div><h3 className="font-semibold text-[#284a36]">Programs</h3><p className="mt-1">{ageGroups.join(' · ')}</p></div>}
        <div>
          <h3 className="font-semibold text-[#284a36]">Centre information</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {center.CWELCC_participant && <span className="rounded-full bg-[#f2f4ee] px-3 py-1 text-xs font-medium">CWELCC</span>}
            {center.subsidy_available && <span className="rounded-full bg-[#f2f4ee] px-3 py-1 text-xs font-medium">Subsidy</span>}
            <span className="inline-flex items-center gap-1 rounded-full bg-[#f2f4ee] px-3 py-1 text-xs font-medium"><Star size={13} /> Quality rating: {avgRating ? avgRating.toFixed(1) : 'N/A'}</span>
          </div>
        </div>
        {center.languages_spoken.length > 0 && (
          <div><h3 className="font-semibold text-[#284a36]">Languages</h3><p className="mt-1">{center.languages_spoken.slice(0, 2).join(' · ')}{center.languages_spoken.length > 2 ? ` + ${center.languages_spoken.length - 2} more` : ''}</p></div>
        )}
        <div className="flex flex-wrap gap-x-5 gap-y-3 pt-1">
          {center.center_contact.website && <a href={center.center_contact.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-[#175d3e] underline-offset-2 hover:underline">Website <ExternalLink size={14} /></a>}
          <a href={center.center_listing_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-[#175d3e] underline-offset-2 hover:underline">Toronto.ca listing <ExternalLink size={14} /></a>
        </div>
      </div>
    </article>
  );
};
