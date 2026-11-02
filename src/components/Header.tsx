import { Baby } from 'lucide-react';

export const Header = () => (
  <header className="flex h-14 shrink-0 items-center gap-3 px-4">
    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#175d3e] text-white">
      <Baby size={22} aria-hidden="true" />
    </div>
    <div>
      <h1 className="text-xl font-bold leading-tight tracking-tight text-[#17392a]">Muso</h1>
      <p className="text-[11px] font-medium leading-tight text-[#6a7c6f]">Childcare & food options · Toronto</p>
    </div>
  </header>
);
