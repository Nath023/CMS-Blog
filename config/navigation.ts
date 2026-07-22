import { siteConfig } from './site';

export const navigationConfig = {
  mainNav: [
    { name: 'Blog Home', path: '/blog' },
    { name: 'Free Guides', path: '/guides' },
    { name: 'Search', path: '/blog/search' },
    { name: `About ${siteConfig.name}`, path: siteConfig.url },
  ],
  footerLinks: [
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Service', path: '/terms' },
  ]
};
