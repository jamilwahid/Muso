import { Lightbulb, Linkedin, Mail } from 'lucide-react';

export const Footer = () => (
  <footer className="shrink-0 border-t border-[#dce8de] bg-[#fafbf7] px-4 py-2 text-[#617268] sm:px-6">
    <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-1 sm:flex-row sm:gap-4">
      <div className="text-center sm:text-left">
        <p className="text-[11px] leading-4">Food options are from City listings. Confirm current practices with the centre.</p>
        <p className="mt-0.5 text-xs leading-4 text-[#425d4e]">
          Made with <span aria-label="love">❤️</span> by <span className="font-semibold text-[#175d3e]">Jamil</span> - a tired first-time dad and spreadsheet survivor!
        </p>
      </div>
      <nav aria-label="Connect with Muso" className="flex shrink-0 items-center gap-1">
        <a href="https://www.linkedin.com/in/jamilwahid/" target="_blank" rel="noopener noreferrer" aria-label="Connect on LinkedIn" className="flex h-10 w-10 items-center justify-center rounded-full text-[#175d3e] hover:bg-[#e6f1e8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#175d3e]"><Linkedin size={18} /></a>
        <a href="mailto:jamil.wahid08@gmail.com" aria-label="Send an email" className="flex h-10 w-10 items-center justify-center rounded-full text-[#175d3e] hover:bg-[#e6f1e8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#175d3e]"><Mail size={18} /></a>
        <a href="https://forms.gle/TArjxyRiUtAhQ9277" target="_blank" rel="noopener noreferrer" aria-label="Suggest a feature" className="flex h-10 w-10 items-center justify-center rounded-full text-[#175d3e] hover:bg-[#e6f1e8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#175d3e]"><Lightbulb size={18} /></a>
      </nav>
    </div>
  </footer>
);
