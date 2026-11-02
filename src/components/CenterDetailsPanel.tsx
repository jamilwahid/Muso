import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Center } from '../types/center';
import { CenterCard } from './CenterCard';

interface CenterDetailsPanelProps {
  center: Center;
  onClose: () => void;
}

export const CenterDetailsPanel: React.FC<CenterDetailsPanelProps> = ({ center, onClose }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const updateOverflow = useCallback(() => {
    const element = scrollRef.current;
    setCanScrollDown(!!element && element.scrollTop + element.clientHeight < element.scrollHeight - 1);
  }, []);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;
    updateOverflow();
    const observer = new ResizeObserver(updateOverflow);
    observer.observe(element);
    if (element.firstElementChild) observer.observe(element.firstElementChild);
    return () => observer.disconnect();
  }, [center, updateOverflow]);

  return (
    <aside aria-label="Selected centre details" className="absolute inset-x-2 bottom-2 z-50 flex max-h-[min(60%,calc(100%-11rem))] flex-col overflow-hidden rounded-[24px] border border-[#dce8de] bg-[#fafbf7] shadow-[0_8px_30px_rgba(25,50,32,0.2)] md:inset-x-auto md:bottom-3 md:left-4 md:top-[110px] md:max-h-none md:w-[430px] md:max-w-[calc(100%-2rem)]">
      <div className="z-10 flex shrink-0 justify-end bg-[#fafbf7] px-3 pt-2">
        <button type="button" onClick={onClose} aria-label="Close centre details" className="flex h-10 w-10 items-center justify-center rounded-full text-2xl text-[#355343] hover:bg-[#edf4ed]">×</button>
      </div>
      <div ref={scrollRef} onScroll={updateOverflow} className="min-h-0 overflow-y-auto">
        <CenterCard center={center} />
      </div>
      {canScrollDown && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 flex h-9 items-end justify-center bg-gradient-to-t from-[#fafbf7] via-[#fafbf7]/90 to-transparent pb-0.5 text-[#688b73]">
          <ChevronDown size={18} />
        </div>
      )}
    </aside>
  );
};
