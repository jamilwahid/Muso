import { useRef, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Center } from '../types/center';
import { CenterCard } from './CenterCard';

interface CenterDetailsPanelProps {
  center: Center;
  onClose: () => void;
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
}

export const CenterDetailsPanel: React.FC<CenterDetailsPanelProps> = ({ center, onClose, expanded, onExpandedChange }) => {
  const touchStart = useRef<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const programs = [...new Set(center.programs.map(program => program.age_group).filter(Boolean))];
  const handleTouchStart = (event: React.TouchEvent) => { touchStart.current = event.touches[0].clientY; setDragging(true); };
  const handleTouchEnd = (event: React.TouchEvent) => {
    if (touchStart.current !== null) {
      const delta = event.changedTouches[0].clientY - touchStart.current;
      if (Math.abs(delta) > 35) event.preventDefault();
      if (delta < -35) onExpandedChange(true);
      if (delta > 35) onExpandedChange(false);
    }
    touchStart.current = null;
    setDragging(false);
  };

  return (
    <aside aria-label="Selected centre details" className={`absolute inset-x-0 bottom-0 z-50 flex flex-col overflow-hidden rounded-t-[24px] border border-[#dce8de] bg-[#fafbf7] shadow-[0_-5px_24px_rgba(25,50,32,0.18)] md:inset-x-auto md:bottom-3 md:left-4 md:top-[110px] md:w-[430px] md:max-w-[calc(100%-2rem)] md:rounded-[24px] ${expanded ? 'h-[min(75%,calc(100%-5rem))]' : 'h-[164px]'} md:h-auto`}>
      <div className="relative shrink-0 bg-[#fafbf7]">
        <div className="flex justify-center md:hidden" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} onTouchCancel={() => { touchStart.current = null; setDragging(false); }}>
          <button type="button" onClick={() => { if (!dragging) onExpandedChange(!expanded); }} aria-label={expanded ? 'Collapse centre details' : 'Expand centre details'} aria-expanded={expanded} className="flex h-9 w-24 touch-none items-center justify-center"><span className="h-1 w-10 rounded-full bg-[#a8bbae]" /></button>
        </div>
        <button type="button" onClick={onClose} aria-label="Close centre details" className="absolute right-3 top-1 flex h-10 w-10 items-center justify-center rounded-full text-2xl text-[#355343] hover:bg-[#edf4ed] md:static md:ml-auto md:mr-3 md:mt-2">×</button>
      </div>
      <div className={`${expanded ? 'hidden' : 'block'} min-h-0 px-5 pb-[max(12px,env(safe-area-inset-bottom))] md:hidden`}>
        <h2 className="line-clamp-2 pr-8 text-lg font-semibold leading-tight text-[#17392a]">{center.center_name}</h2>
        <p className="mt-1 truncate text-sm text-[#607267]">{center.location.address}{center.location.postal_code ? `, ${center.location.postal_code}` : ''}</p>
        <div className="flex min-w-0 items-center justify-between gap-2">
          <p className="min-w-0 truncate text-xs text-[#607267]">{programs.length ? programs.join(' · ') : 'Programs not listed'}</p>
          <button type="button" onClick={() => onExpandedChange(true)} className="inline-flex min-h-9 shrink-0 items-center gap-1 text-sm font-semibold text-[#175d3e]">View details <ChevronUp size={16} aria-hidden="true" /></button>
        </div>
      </div>
      <div className={`${expanded ? 'block' : 'hidden'} min-h-0 overflow-y-auto overscroll-contain pb-[env(safe-area-inset-bottom)] md:block`}>
        <CenterCard center={center} />
        <button type="button" onClick={() => onExpandedChange(false)} className="mx-5 mb-4 inline-flex min-h-10 items-center gap-1 text-sm font-semibold text-[#175d3e] md:hidden">Show less <ChevronDown size={16} aria-hidden="true" /></button>
      </div>
    </aside>
  );
};
