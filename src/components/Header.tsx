import React from 'react';
import { Baby, MoonStar } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="border-b border-emerald-950/10 bg-white">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-4 sm:px-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-800 text-white">
          <Baby className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Muso</h1>
          <p className="text-sm text-slate-600">Toronto childcare with halal information</p>
        </div>
        <MoonStar className="ml-auto h-6 w-6 text-emerald-800" aria-hidden="true" />
      </div>
    </header>
  );
};