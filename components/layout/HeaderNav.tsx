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
      <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 shadow-sm' : 'bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm border-b border-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 shrink-0 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg">
              <Image src={siteLogoUrl} alt={siteName} width={800} height={800} quality={100} className="w-auto h-8 md:h-10 object-contain transition-transform group-hover:scale-105" referrerPolicy="no-referrer" priority />
              <span className="text-lg md:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white hidden lg:block">
                {siteName}
              </span>
            </Link>

            {/* Main Navigation (Desktop) */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2 h-full ml-6 relative">
              {navigationConfig.mainNav.map((item) => {
                const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));
                
                if (item.megaMenu) {
                  return (
                    <div key={item.name} className="group h-full flex items-center">
                      <Link 
                        href={item.path}
                        className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${isActive ? 'text-primary bg-primary/10' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                      >
                        {item.name}
                        <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
                      </Link>
                      
                      {/* Mega Menu Dropdown */}
                      <div className="absolute top-[90%] left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-300 w-[600px] pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto z-50">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 grid grid-cols-2 gap-x-12 gap-y-6">
                          {item.megaMenu.map((subItem) => (
                            <Link 
                              key={subItem.name} 
                              href={subItem.path}
                              className="flex flex-col group/sub"
                            >
                              <span className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover/sub:text-primary transition-colors focus:outline-none">
                                {subItem.name}
                              </span>
                              <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                                Explore {subItem.name.toLowerCase()} resources and articles.
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
                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${isActive ? 'text-primary bg-primary/10' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0 h-full ml-auto lg:ml-0">
              <button onClick={() => setSearchOpen(true)} className="p-2 flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary group" aria-label="Search (Ctrl+K)">
                <Search className="w-5 h-5 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
              </button>
              
              <button className="hidden sm:flex p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary group" aria-label="Bookmarks">
                <Bookmark className="w-5 h-5 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
              </button>
              
              <button className="hidden sm:flex p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary group relative" aria-label="Notifications">
                <Bell className="w-5 h-5 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-900"></span>
              </button>

              <div className="h-5 w-[1px] bg-slate-200 dark:bg-slate-800 hidden sm:block mx-2"></div>

              <div className="hidden sm:flex">{featuresConfig.enableDarkMode && <ThemeToggle />}</div>

              {/* Auth / User */}
              <div className="hidden sm:flex items-center gap-3 ml-3">
                <Link href="/admin/login" className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors focus:outline-none focus-visible:underline flex items-center gap-2">
                  <User className="w-4 h-4" /> Log In
                </Link>
                <Link href="/register" className="text-sm font-semibold bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2.5 rounded-full hover:bg-primary dark:hover:bg-primary hover:text-white transition-all shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
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
