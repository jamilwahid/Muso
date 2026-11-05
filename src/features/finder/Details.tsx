import { useEffect, useRef, useState } from 'react';
import { Check, Copy, ExternalLink, Globe, MapPin, Phone, X } from 'lucide-react';
import type { Center } from '../../types/center';
import { matchesFoodOption } from '../../utils/foodOptions';
import { choices } from './foodOptions';
import { ExternalButtonLink } from '../../ui/Button';

export function Details({ center, close }: { center: Center; close: () => void }) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [copyStatus, setCopyStatus] = useState<{ field: 'address' | 'phone'; message: string; success: boolean } | null>(null);
  useEffect(() => { headingRef.current?.focus(); setCopyStatus(null); }, [center.center_id]);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const phone = center.center_contact.phone?.trim();
  const digits = phone?.replace(/[^\d+]/g, '');
  const address = `${center.location.address}${center.location.postal_code ? `, ${center.location.postal_code}` : ''}`;
  const food = choices.filter(option => matchesFoodOption(center.dietary_services, option.value));
  const programs = [...new Set(center.programs.map(program => program.age_group).filter(Boolean))];
  const copyValue = async (field: 'address' | 'phone', value: string) => {
    if (timer.current) clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(value);
      setCopyStatus({ field, message: field === 'address' ? 'Address copied' : 'Phone number copied', success: true });
    } catch {
      setCopyStatus({ field, message: 'Could not copy. Select the text to copy it.', success: false });
    }
    timer.current = setTimeout(() => setCopyStatus(null), 2500);
  };
  const copyButton = (field: 'address' | 'phone', value: string) => <button className="copy-button" type="button" onClick={() => void copyValue(field, value)} aria-label={`Copy ${field === 'phone' ? 'phone number' : 'address'}`} title={`Copy ${field === 'phone' ? 'phone number' : 'address'}`}>{copyStatus?.field === field && copyStatus.success ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}</button>;
  return <aside className="details" aria-label="Centre details">
    <div className="details-top"><h2 ref={headingRef} tabIndex={-1}>{center.center_name}</h2><button className="icon-button" aria-label="Close centre details" onClick={close}><X size={20}/></button></div>
    <div className="details-body">
      <div className="contact-row"><MapPin size={17} aria-hidden="true"/><span>{address}</span>{copyButton('address', address)}</div>
      {phone && digits && <div className="contact-row"><Phone size={17} aria-hidden="true"/><a href={`tel:${digits}`}>{phone}</a>{copyButton('phone', phone)}</div>}
      {center.center_contact.website && <div className="contact-row website-row"><Globe size={17} aria-hidden="true"/><a href={center.center_contact.website} target="_blank" rel="noopener noreferrer">Centre website <ExternalLink size={14} aria-hidden="true"/><span className="visually-hidden"> (opens in a new tab)</span></a></div>}
      <p className="copy-status" role="status" aria-live="polite">{copyStatus?.message || ''}</p>
      <section className="detail-section"><h3>Programs</h3><p>{programs.length ? programs.join(' · ') : 'Programs not listed'}</p></section>
      <section className="detail-section"><h3>Food options listed</h3><p>{food.length ? food.map(option => option.label).join(' · ') : 'No food options listed'}</p><p className="confirm-food">Please confirm food options with the centre.</p></section>
    </div>
    <div className="detail-actions">
      {phone && digits ? <ExternalButtonLink variant="primary" href={`tel:${digits}`} aria-label={`Call ${center.center_name} at ${phone}`}><Phone size={17} aria-hidden="true"/> Call centre</ExternalButtonLink> : <span className="call-unavailable">Phone number not listed</span>}
      {center.center_listing_url && <ExternalButtonLink className="listing-button" href={center.center_listing_url} target="_blank" rel="noopener noreferrer">Toronto.ca listing <ExternalLink size={15} aria-hidden="true"/><span className="visually-hidden"> (opens in a new tab)</span></ExternalButtonLink>}
    </div>
  </aside>;
}
