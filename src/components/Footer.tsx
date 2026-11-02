import { MessageCircle } from 'lucide-react';

export const Footer = () => (
  <footer className="shrink-0 border-t border-[#dce8de] bg-[#fafbf7] px-4 py-3 text-center">
    <p className="text-xs leading-5 text-[#425d4e] sm:text-sm">
      Made with ❤️ by an overwhelmed first-time Muslim dad in Toronto.{' '}
      <a href="mailto:jamil.wahid08@gmail.com?subject=Muso%20feedback" aria-label="Send feedback by email" title="Send feedback" className="inline-flex h-10 w-10 items-center justify-center rounded-full align-middle text-[#175d3e] hover:bg-[#e6f1e8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#175d3e]"><MessageCircle size={19} aria-hidden="true" /></a>
    </p>
  </footer>
);
