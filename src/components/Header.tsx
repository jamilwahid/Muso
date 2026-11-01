import React from 'react';
import { Baby } from 'lucide-react';

export const Header: React.FC = () => (
  <header className="border-b border-[#dedacf] bg-[#fffdf8]">
    <div className="mx-auto flex h-[72px] max-w-[1600px] items-center px-4 sm:px-6">
      <a href="/" className="flex items-center gap-3 text-[#202b24] no-underline">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#176044] shadow-[0_3px_8px_rgba(18,75,54,0.16)] text-white">
          <Baby className="h-5 w-5" />
        </span>
        <span className="text-[21px] font-bold tracking-[-0.04em]">Muso</span>
      </a>
      <span className="ml-4 hidden border-l border-[#dedacf] pl-4 text-sm text-[#606b62] sm:block">
        Toronto childcare food options
      </span>
      <span className="ml-auto rounded-full border border-[#d8e6d8] bg-[#edf5ed] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-[#176044]">
        Toronto
      </span>
    </div>
  </header>
);