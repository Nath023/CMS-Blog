'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown, Search, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { featuresConfig } from '@/config/features';

export function MobileMenu({ navItems }: { navItems: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();

  const toggleSection = (name: string) => {
    setOpenSection(openSection === name ? null : name);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 -mr-2 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors focus:outline-none"
        aria-label="Toggle mobile menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div className="fixed top-[4rem] md:top-[5rem] left-0 right-0 bottom-0 bg-white dark:bg-[#0a0a0a] overflow-y-auto animate-in fade-in slide-in-from-top-2 z-[60]">
          <div className="flex flex-col py-6 px-4 gap-2 max-w-7xl mx-auto">
            
            <div className="mb-4 px-2">
              <Link
                href="/blog/search"
                className="flex items-center gap-3 w-full px-4 py-3 bg-slate-100 dark:bg-slate-900 rounded-xl text-slate-500 dark:text-slate-400 font-medium hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors focus:outline-none"
                onClick={() => setIsOpen(false)}
              >
                <Search className="w-5 h-5" />
                Search articles, categories...
              </Link>
            </div>

            {navItems.map((item) => (
              <div key={item.name} className="flex flex-col border-b border-slate-100 dark:border-slate-800/50 last:border-0 pb-2">
                {item.megaMenu ? (
                  <>
                    <button 
                      onClick={() => toggleSection(item.name)}
                      className="flex items-center justify-between px-6 py-3 text-base font-semibold text-slate-900 dark:text-slate-100 focus:outline-none rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                    >
                      {item.name}
                      <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${openSection === item.name ? 'rotate-180' : ''}`} />
                    </button>
                    {openSection === item.name && (
                      <div className="flex flex-col gap-1 px-4 py-2 mt-1 bg-slate-50 dark:bg-slate-900/50 rounded-xl animate-in fade-in slide-in-from-top-2">
                        {item.megaMenu.map((subItem: any) => (
                          <Link 
                            key={subItem.name} 
                            href={subItem.path} 
                            className="px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
                            onClick={() => setIsOpen(false)}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link 
                    href={item.path} 
                    className="flex items-center px-6 py-3 text-base font-semibold text-slate-900 dark:text-slate-100 hover:text-primary dark:hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition-colors focus:outline-none"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
            
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-4 px-2">
              {featuresConfig.enableDarkMode && (
                <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-900 rounded-xl mb-2">
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Theme</span>
                  <div className="flex bg-slate-200 dark:bg-slate-800 rounded-lg p-1">
                    <button 
                      onClick={() => setTheme('light')}
                      className={`p-1.5 rounded-md transition-colors ${theme === 'light' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                      aria-label="Light Mode"
                    >
                      <Sun className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setTheme('dark')}
                      className={`p-1.5 rounded-md transition-colors ${theme === 'dark' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500'}`}
                      aria-label="Dark Mode"
                    >
                      <Moon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
              <Link
                href="/admin/login"
                className="w-full py-3 px-4 text-center text-sm font-bold text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors focus:outline-none"
                onClick={() => setIsOpen(false)}
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="w-full py-3 px-4 text-center text-sm font-bold bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                onClick={() => setIsOpen(false)}
              >
                Sign Up
              </Link>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
