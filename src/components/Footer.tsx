import { Lightbulb, Linkedin, Mail } from 'lucide-react';

const iconLink = 'inline-flex h-10 w-10 items-center justify-center rounded-full text-[#175d3e] hover:bg-[#e6f1e8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#175d3e]';

export const Footer = () => (
  <footer className="shrink-0 border-t border-[#dce8de] bg-[#fafbf7] px-4 py-2 text-center text-[#617268]">
    <p className="text-[11px] leading-4">Food options are from City listings. Confirm current practices with the centre.</p>
    <p className="mt-0.5 text-xs leading-4 text-[#425d4e] sm:text-sm">
      Made with ❤️ by{' '}
      <a href="https://www.linkedin.com/in/jamilwahid/" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#175d3e] underline underline-offset-2">Jamil</a>
      {' '}- a tired first-time dad and spreadsheet survivor!
    </p>
    <nav aria-label="Connect with Muso" className="flex items-center justify-center gap-2">
      <a href="https://www.linkedin.com/in/jamilwahid/" target="_blank" rel="noopener noreferrer" aria-label="Connect on LinkedIn" title="Connect on LinkedIn" className={iconLink}><Linkedin size={19} /></a>
      <a href="mailto:jamil.wahid08@gmail.com" aria-label="Send an email" title="Send an email" className={iconLink}><Mail size={19} /></a>
      <a href="https://forms.gle/TArjxyRiUtAhQ9277" target="_blank" rel="noopener noreferrer" aria-label="Suggest a feature" title="Suggest a feature" className={iconLink}><Lightbulb size={19} /></a>
    </nav>
  </footer>
);
