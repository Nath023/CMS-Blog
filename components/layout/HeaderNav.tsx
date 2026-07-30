'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Search, Bookmark, Bell, ChevronDown, User } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { siteConfig } from '@/config/site';
import { featuresConfig } from '@/config/features';
import { navigationConfig } from '@/config/navigation';
import { MobileMenu } from './MobileMenu';
import { SearchDialog } from './SearchDialog';

export function HeaderNav({ settings }: { settings?: any }) {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const siteLogoUrl = settings?.site_logo_url || '/logo.svg';
  const siteName = settings?.site_name || siteConfig.name;

  return (
    <>
      <header className={`fixed top-0 md:top-4 left-0 right-0 z-50 w-full md:max-w-5xl md:mx-auto transition-all duration-300 ${scrolled ? 'md:px-4' : 'md:px-4'}`}>
        <div className={`mx-auto w-full transition-all duration-300 ${scrolled ? 'bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm md:rounded-full' : 'bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm border-b md:border border-transparent md:rounded-full'}`}>
          <div className="px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 shrink-0 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg">
              <Image src={siteLogoUrl} alt={siteName} width={800} height={800} quality={100} className="w-auto h-7 object-contain transition-transform group-hover:scale-105" referrerPolicy="no-referrer" priority />
              <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white hidden lg:block">
                {siteName}
              </span>
            </Link>

            {/* Main Navigation (Desktop) */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2 h-full absolute left-1/2 -translate-x-1/2">
              {navigationConfig.mainNav.map((item) => {
                const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));
                
                if (item.megaMenu) {
                  return (
                    <div key={item.name} className="group h-full flex items-center relative">
                      <Link 
                        href={item.path}
                        className={`px-3 py-2 rounded-full text-sm font-semibold transition-colors flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${isActive ? 'text-primary bg-primary/10' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                      >
                        {item.name}
                        <ChevronDown className="w-3 h-3 transition-transform duration-300 group-hover:rotate-180" />
                      </Link>
                      
                      {/* Mega Menu Dropdown */}
                      <div className="absolute top-[80%] left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-300 w-[500px] pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto z-50">
                        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/50 dark:border-slate-800/50 p-6 grid grid-cols-2 gap-x-8 gap-y-4">
                          {item.megaMenu.map((subItem) => (
                            <Link 
                              key={subItem.name} 
                              href={subItem.path}
                              className="flex flex-col group/sub p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                            >
                              <span className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover/sub:text-primary transition-colors focus:outline-none">
                                {subItem.name}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <Link 
                    key={item.name} 
                    href={item.path} 
                    className={`px-3 py-2 rounded-full text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${isActive ? 'text-primary bg-primary/10' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0 h-full ml-auto lg:ml-0">
              <button onClick={() => setSearchOpen(true)} className="p-2 flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary group" aria-label="Search (Ctrl+K)">
                <Search className="w-4 h-4 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
              </button>

              <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800 hidden sm:block mx-1"></div>

              <div className="hidden sm:flex">{featuresConfig.enableDarkMode && <ThemeToggle />}</div>

              {/* Auth / User */}
              <div className="hidden sm:flex items-center gap-2 ml-1">
                <Link href="/admin/login" className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors focus:outline-none px-3 py-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                  Log In
                </Link>
                <Link href="/register" className="text-sm font-semibold bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-full hover:bg-primary dark:hover:bg-primary hover:text-white transition-all shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                  Sign Up
                </Link>
              </div>

              {/* Mobile Menu */}
              <div className="lg:hidden flex items-center h-full ml-1">
                <MobileMenu navItems={navigationConfig.mainNav} />
              </div>
            </div>
          </div>
        </div>
      </header>

      <SearchDialog isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
