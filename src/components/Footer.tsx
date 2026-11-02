const iconLink = 'inline-flex h-10 w-10 items-center justify-center rounded-full text-[#175d3e] hover:bg-[#e6f1e8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#175d3e]';

export const Footer = () => (
  <footer className="shrink-0 border-t border-[#dce8de] bg-[#fafbf7] px-4 py-3 text-center">
    <p className="text-xs leading-5 text-[#425d4e] sm:text-sm">
      Made with ❤️ by{' '}
      <a href="https://www.linkedin.com/in/jamilwahid/" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#175d3e] hover:underline">Jamil</a>
      {' '}- a tired first-time dad and spreadsheet survivor!
    </p>
    <nav aria-label="Connect with Muso" className="mt-1 flex items-center justify-center gap-1">
      <a href="https://www.linkedin.com/in/jamilwahid/" target="_blank" rel="noopener noreferrer" aria-label="Connect on LinkedIn" title="Connect on LinkedIn" className={iconLink}>
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5"><path fill="currentColor" d="M3.5 2h17A1.5 1.5 0 0 1 22 3.5v17a1.5 1.5 0 0 1-1.5 1.5h-17A1.5 1.5 0 0 1 2 20.5v-17A1.5 1.5 0 0 1 3.5 2Z"/><path fill="#fafbf7" d="M6 9h2.5v9H6zM7.25 5.5a1.4 1.4 0 1 1 0 2.8 1.4 1.4 0 0 1 0-2.8ZM10.5 9h2.4v1.2a3 3 0 0 1 2.7-1.4c2.1 0 2.9 1.4 2.9 3.4V18H16v-5.1c0-1.2-.3-1.9-1.4-1.9-1.2 0-1.6.8-1.6 2V18h-2.5z"/></svg>
      </a>
      <a href="mailto:jamil.wahid08@gmail.com" aria-label="Send an email" title="Send an email" className={iconLink}>
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6"><path fill="currentColor" d="M3 5h18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"/><path d="m2 7 10 7L22 7" fill="none" stroke="#fafbf7" strokeWidth="1.4" strokeLinejoin="round"/></svg>
      </a>
      <a href="https://forms.gle/TArjxyRiUtAhQ9277" target="_blank" rel="noopener noreferrer" aria-label="Suggest a feature" title="Suggest a feature" className={iconLink}>
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5"><path fill="currentColor" d="M12 2a7 7 0 0 0-4.4 12.45c.77.63 1.4 1.36 1.67 2.3h5.46c.27-.94.9-1.67 1.67-2.3A7 7 0 0 0 12 2ZM9.5 18h5v1.2h-5zm.65 2.3h3.7a2 2 0 0 1-3.7 0Z"/><path d="M7.8 9A4.2 4.2 0 0 1 12 4.8" fill="none" stroke="#fafbf7" strokeWidth="1.1" strokeLinecap="round"/></svg>
      </a>
    </nav>
  </footer>
);
