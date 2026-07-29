'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown, Search, Moon, Sun, Check, Palette } from 'lucide-react';
import { useTheme } from 'next-themes';
import { featuresConfig } from '@/config/features';
import { motion, AnimatePresence } from 'motion/react';
import { useColorTheme, ColorTheme } from '@/components/theme-provider';

const COLOR_PRESETS: { name: string; value: ColorTheme; hex: string }[] = [
  { name: "Coral", value: "default", hex: "#FF6B6B" },
  { name: "Rose", value: "rose", hex: "#e11d48" },
  { name: "Blue", value: "blue", hex: "#3b82f6" },
  { name: "Green", value: "green", hex: "#10b981" },
  { name: "Violet", value: "violet", hex: "#8b5cf6" },
  { name: "Orange", value: "orange", hex: "#f97316" },
];

export function MobileMenu({ navItems }: { navItems: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();
  const { colorTheme, setColorTheme } = useColorTheme();

  const toggleSection = (name: string) => {
    setOpenSection(openSection === name ? null : name);
  };

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 -mr-2 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors focus:outline-none relative z-[70]"
        aria-label="Toggle mobile menu"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ opacity: 0, rotate: 90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -90 }}
              transition={{ duration: 0.2 }}
            >
              <Menu className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="absolute top-[4rem] md:top-[5rem] left-0 right-0 h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] bg-white dark:bg-[#0a0a0a] overflow-y-auto z-[60]"
          >
            <div className="flex flex-col py-6 px-4 gap-2 max-w-7xl mx-auto min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-5rem)]">
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-4 px-2"
              >
                <Link
                  href="/blog/search"
                  className="flex items-center gap-3 w-full px-4 py-3 bg-slate-100 dark:bg-slate-900 rounded-xl text-slate-500 dark:text-slate-400 font-medium hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors focus:outline-none"
                  onClick={() => setIsOpen(false)}
                >
                  <Search className="w-5 h-5" />
                  Search articles, categories...
                </Link>
              </motion.div>

              {navItems.map((item, index) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  key={item.name} 
                  className="flex flex-col border-b border-slate-100 dark:border-slate-800/50 last:border-0 pb-2"
                >
                  {item.megaMenu ? (
                    <>
                      <button 
                        type="button"
                        onClick={() => toggleSection(item.name)}
                        aria-expanded={openSection === item.name}
                        aria-controls={`mobile-menu-${item.name.toLowerCase().replace(/\\s+/g, '-')}`}
                        className="flex w-full items-center justify-between px-6 py-3 text-base font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                      >
                        {item.name}
                        <motion.div
                          animate={{ rotate: openSection === item.name ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="w-5 h-5" />
                        </motion.div>
                      </button>
                      <AnimatePresence>
                        {openSection === item.name && (
                          <motion.div 
                            id={`mobile-menu-${item.name.toLowerCase().replace(/\\s+/g, '-')}`}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="flex flex-col gap-1 px-4 py-2 mt-1 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                              {item.megaMenu.map((subItem: any) => (
                                <Link 
                                  key={subItem.name} 
                                  href={subItem.path} 
                                  className="flex w-full px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                  onClick={() => setIsOpen(false)}
                                >
                                  {subItem.name}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link 
                      href={item.path} 
                      className="flex items-center w-full px-6 py-3 text-base font-semibold text-slate-900 dark:text-slate-100 hover:text-primary dark:hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )}
                </motion.div>
              ))}
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + navItems.length * 0.05 }}
                className="mt-auto pt-8 pb-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-4 px-2"
              >
                {featuresConfig.enableDarkMode && (
                  <div className="flex flex-col gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-900 rounded-xl mb-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Mode</span>
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
                    
                    <div className="border-t border-slate-200 dark:border-slate-800 pt-3">
                      <span className="text-sm font-medium text-slate-900 dark:text-slate-100 block mb-2">Color Theme</span>
                      <div className="grid grid-cols-6 gap-2">
                        {COLOR_PRESETS.map((preset) => (
                          <button
                            key={preset.value}
                            onClick={() => setColorTheme(preset.value)}
                            className="group relative flex items-center justify-center rounded-full transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary"
                            aria-label={`Select ${preset.name} theme`}
                          >
                            <div 
                              className="w-8 h-8 rounded-full shadow-inner flex items-center justify-center border border-black/10 dark:border-white/10" 
                              style={{ backgroundColor: preset.hex }}
                            >
                              {colorTheme === preset.value && (
                                <Check className="w-4 h-4 text-white drop-shadow-md" />
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
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
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
