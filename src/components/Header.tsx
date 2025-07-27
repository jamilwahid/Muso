import React from 'react';
import { Baby } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-6 py-5 h-[89px]">
      <div className="flex items-center justify-between max-w-7xl mx-auto h-full">
        {/* Left spacer for centering */}
        <div className="w-10"></div>
        
        {/* Centered logo */}
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-3 rounded-2xl shadow-lg">
            <Baby className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Muso
            </h1>
            <p className="text-sm text-slate-500 font-medium">Your sidekick in the infant childcare hunt</p>
          </div>
        </div>
        
        {/* Right spacer for centering */}
        <div className="w-10"></div>
      </div>
    </header>
  );
};