import { Baby, MoreHorizontal } from 'lucide-react';
import { Footer } from './Footer';

export const Header = () => (
  <header className="relative flex h-12 shrink-0 items-center gap-2 px-3 md:h-14 md:gap-3 md:px-4">
    <div className="flex h-8 w-8 items-center justify-center rounded-xl md:h-10 md:w-10 bg-[#175d3e] text-white">
      <Baby size={22} aria-hidden="true" />
    </div>
    <div>
      <h1 className="text-lg font-bold md:text-xl leading-tight tracking-tight text-[#17392a]">Muso</h1>
      <p className="hidden text-[11px] font-medium leading-tight text-[#6a7c6f] md:block">Childcare & food options · Toronto</p>
    </div>
    <details className="ml-2 md:hidden">
      <summary aria-label="About Muso" className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-full text-[#175d3e] hover:bg-[#edf5ed] [&::-webkit-details-marker]:hidden"><MoreHorizontal size={20} /></summary>
      <div className="absolute left-0 top-[calc(100%+8px)] z-50 w-[min(320px,calc(100vw-24px))] overflow-hidden rounded-2xl border border-[#dce8de] bg-[#fafbf7] shadow-lg"><Footer /></div>
    </details>
  </header>
);
