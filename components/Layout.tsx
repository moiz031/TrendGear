
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  return (
    <div className="min-h-screen flex flex-col items-center p-4 md:p-8">
      <header className="w-full max-w-6xl mb-12 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">GrowthFlow <span className="text-indigo-400">AI</span></h1>
        </div>
        <nav className="hidden md:flex space-x-6 text-sm font-medium text-slate-400">
          <span className="cursor-default hover:text-white transition">Enterprise Solution</span>
          <span className="cursor-default hover:text-white transition">Direct Strategy</span>
          <span className="cursor-default hover:text-white transition">24/7 Advisor</span>
        </nav>
      </header>
      <main className="w-full max-w-6xl flex-grow">
        {children}
      </main>
      <footer className="w-full max-w-6xl py-8 mt-12 border-t border-slate-800 text-center text-slate-500 text-sm">
        &copy; 2024 GrowthFlow AI Digital Marketing Powerhouse. Professional Grade.
      </footer>
    </div>
  );
};

export default Layout;
