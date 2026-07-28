'use client';

import React from 'react';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { navigationConfig } from '@/config/navigation';
import { socialConfig } from '@/config/social';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-[#050505] text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8 mb-16">
          
          {/* Column 1: Brand & Newsletter */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{siteConfig.name}</h3>
            <p className="text-sm leading-relaxed max-w-sm">
              {siteConfig.description}
            </p>
            <form className="flex flex-col sm:flex-row gap-2 max-w-sm">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary w-full"
                required
              />
              <button 
                type="submit"
                className="bg-primary text-primary-foreground text-sm font-semibold px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
            
            <div className="flex gap-4">
              {[
                { name: 'LinkedIn', icon: (props: any) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>, href: socialConfig.links.linkedin },
                { name: 'Twitter', icon: (props: any) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>, href: socialConfig.links.twitter },
                { name: 'GitHub', icon: (props: any) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>, href: socialConfig.links.github },
              ].map((social) => (
                <a 
                  key={social.name}
                  href={social.href} 
                  aria-label={social.name}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm p-1"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Explore */}
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900 dark:text-white">Explore</h4>
            <ul className="space-y-3">
              {navigationConfig.footer.explore.map((item) => (
                <li key={item.name}>
                  <Link href={item.path} className="text-sm hover:text-primary transition-colors focus:outline-none focus-visible:underline">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900 dark:text-white">Company</h4>
            <ul className="space-y-3">
              {navigationConfig.footer.company.map((item) => (
                <li key={item.name}>
                  <Link href={item.path} className="text-sm hover:text-primary transition-colors focus:outline-none focus-visible:underline">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Support */}
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900 dark:text-white">Support</h4>
            <ul className="space-y-3">
              {navigationConfig.footer.support.map((item) => (
                <li key={item.name}>
                  <Link href={item.path} className="text-sm hover:text-primary transition-colors focus:outline-none focus-visible:underline">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Legal */}
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900 dark:text-white">Legal</h4>
            <ul className="space-y-3">
              {navigationConfig.footer.legal.map((item) => (
                <li key={item.name}>
                  <Link href={item.path} className="text-sm hover:text-primary transition-colors focus:outline-none focus-visible:underline">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Footer */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-sm">
            <p>&copy; {currentYear} {siteConfig.company.name}. All rights reserved.</p>
            <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" aria-hidden="true" />
            <p>Built with Next.js</p>
            <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" aria-hidden="true" />
            <p>v1.0.0</p>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/feed.xml" className="hover:text-primary transition-colors">RSS</Link>
            <Link href="/sitemap.xml" className="hover:text-primary transition-colors">Sitemap</Link>
            <Link href="/changelog" className="hover:text-primary transition-colors">Changelog</Link>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
              className="font-semibold text-slate-900 dark:text-white hover:text-primary dark:hover:text-primary transition-colors focus:outline-none focus-visible:underline"
            >
              Back to Top &uarr;
            </button>
          </div>
        </div>
        
      </div>
    </footer>
  );
}
