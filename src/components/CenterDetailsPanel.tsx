import { useRef, useState } from 'react';
import { Center } from '../types/center';
import { CenterCard } from './CenterCard';

interface CenterDetailsPanelProps {
  center: Center;
  onClose: () => void;
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
}

export const CenterDetailsPanel: React.FC<CenterDetailsPanelProps> = ({ center, onClose, expanded, onExpandedChange }) => {
  const [dragDistance, setDragDistance] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startY = useRef<number | null>(null);
  const didDrag = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentTouchStart = useRef<number | null>(null);

  const endDrag = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (startY.current === null) return;
    const delta = event.clientY - startY.current;
    didDrag.current = Math.abs(delta) > 15;
    if (delta < -45) onExpandedChange(true);
    else if (delta > 60 && expanded) onExpandedChange(false);
    else if (delta > 100) onClose();
    startY.current = null;
    setDragDistance(0);
    setDragging(false);
  };

  const contentTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (contentTouchStart.current === null) return;
    const delta = event.changedTouches[0].clientY - contentTouchStart.current;
    if (delta < -60 && !expanded) onExpandedChange(true);
    else if (delta > 70 && scrollRef.current?.scrollTop === 0) {
      if (expanded) onExpandedChange(false);
      else onClose();
    }
    contentTouchStart.current = null;
  };

  return (
    <aside
      aria-label="Selected centre details"
      style={{ '--sheet-drag': `${dragDistance}px` } as React.CSSProperties}
      className={`mobile-centre-sheet absolute inset-x-0 bottom-0 z-[70] flex flex-col overflow-hidden rounded-t-[24px] border border-[#dce8de] bg-[#fafbf7] shadow-[0_-5px_24px_rgba(25,50,32,0.18)] motion-reduce:transition-none md:inset-x-auto md:bottom-3 md:left-4 md:top-[110px] md:z-50 md:h-auto md:w-[430px] md:max-w-[calc(100%-2rem)] md:rounded-[24px] ${expanded ? 'h-[clamp(40%,calc(86%-var(--sheet-drag)),92%)]' : 'h-[clamp(30%,calc(60%-var(--sheet-drag)),92%)]'} ${dragging ? '' : 'transition-[height] duration-300 ease-out'}`}
    >
      <div className="relative shrink-0 bg-[#fafbf7]">
        <div className="flex justify-center md:hidden">
          <button type="button" aria-label={expanded ? 'Collapse centre details' : 'Expand centre details'} aria-expanded={expanded} className="flex h-9 w-28 touch-none items-center justify-center" onPointerDown={event => { startY.current = event.clientY; didDrag.current = false; setDragging(true); event.currentTarget.setPointerCapture(event.pointerId); }} onPointerMove={event => { if (startY.current !== null) setDragDistance(event.clientY - startY.current); }} onPointerUp={endDrag} onPointerCancel={() => { startY.current = null; setDragDistance(0); setDragging(false); didDrag.current = true; }} onClick={() => { if (didDrag.current) { didDrag.current = false; return; } onExpandedChange(!expanded); }}><span className="h-1 w-10 rounded-full bg-[#a8bbae]" /></button>
        </div>
        <button type="button" onClick={onClose} aria-label="Close centre details" className="absolute right-3 top-1 flex h-10 w-10 items-center justify-center rounded-full text-2xl text-[#355343] hover:bg-[#edf4ed] md:static md:ml-auto md:mr-3 md:mt-2">×</button>
      </div>
      <div ref={scrollRef} onTouchStart={event => { contentTouchStart.current = scrollRef.current?.scrollTop === 0 ? event.touches[0].clientY : null; }} onTouchEnd={contentTouchEnd} onTouchCancel={() => { contentTouchStart.current = null; }} className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-[env(safe-area-inset-bottom)]">
        <CenterCard center={center} />
      </div>
    </aside>
  );
};
