```tsx
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white/95 backdrop-blur-xl border-t border-slate-200/60 px-6 py-6 h-[80px]">
      <div className="max-w-7xl mx-auto h-full">
        <div className="flex flex-col items-center justify-center space-y-2 text-center h-full">
          {/* Main message */}
          <p className="text-xs text-slate-600 font-normal">
            Made with ❤️ by <span className="font-semibold text-indigo-600">Jamil</span> - a tired first-time dad and spreadsheet survivor!
          </p>
          
          {/* Icon-only action buttons */}
          <div className="flex items-center space-x-4">
            <a
              href="https://www.linkedin.com/in/jamilwahid/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-200"
              title="Connect on LinkedIn"
            >
              <i className="fa-brands fa-linkedin fa-lg"></i>
            </a>
            
            <a
              href="mailto:jamil.wahid08@gmail.com"
              className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-200"
              title="Send an email"
            >
              <i className="fa-solid fa-envelope fa-lg"></i>
            </a>
            
            <a
              href="https://forms.gle/TArjxyRiUtAhQ9277"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-200"
              title="Suggest a feature"
            >
              <i className="fa-solid fa-lightbulb ga-lg"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
```