import React from 'react';
import { Baby } from 'lucide-react';

export const Header: React.FC = () => (
  <header className="border-b border-[#e6e2d8] bg-[#fbfaf6]">
    <div className="mx-auto flex h-[68px] max-w-[1600px] items-center px-4 sm:px-6">
      <a href="/" className="flex items-center gap-3 text-slate-900 no-underline">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#214f40] text-white">
          <Baby className="h-5 w-5" />
        </span>
        <span className="text-xl font-bold tracking-tight">Muso</span>
      </a>
      <span className="ml-4 hidden border-l border-[#dedbd1] pl-4 text-sm text-slate-600 sm:block">
        Halal-first childcare finder
      </span>
      <span className="ml-auto text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
        Toronto
      </span>
    </div>
  </header>
);