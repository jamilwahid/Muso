import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-10 border-t border-[#dedacf] bg-[#fffdf8]">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-2 px-4 py-6 text-sm text-[#606b62] sm:px-6">
        <p>Muso is free and open source, made to help Muslim families find childcare that fits their halal needs.</p>
        <p>
          Centre and food information comes from the{' '}
          <a
            href="https://www.toronto.ca/data/children/dmc/a2z/a2za.html"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[#176044] underline decoration-[#a9c9ad] underline-offset-2"
          >
            City of Toronto A–Z licensed child care directory
          </a>
          . Please confirm current food practices with the centre.
        </p>
      </div>
    </footer>
  );
};