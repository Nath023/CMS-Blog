import { siteConfig } from './site';

export const navigationConfig = {
  mainNav: [
    { name: 'Home', path: '/' },
    { 
      name: 'Articles', 
      path: '/blog',
      megaMenu: [
        { name: 'Latest', path: '/blog' },
        { name: 'Trending', path: '/blog?sort=trending' },
        { name: 'Popular', path: '/blog?sort=popular' },
        { name: 'Editor\'s Picks', path: '/blog?filter=editors-picks' },
        { name: 'Featured', path: '/blog?filter=featured' },
        { name: 'Recently Updated', path: '/blog?sort=updated' },
      ]
    },
    { 
      name: 'Categories', 
      path: '/categories',
      megaMenu: [
        { name: 'Technology', path: '/blog/category/technology' },
        { name: 'Business', path: '/blog/category/business' },
        { name: 'Marketing', path: '/blog/category/marketing' },
        { name: 'AI', path: '/blog/category/ai' },
        { name: 'Design', path: '/blog/category/design' },
        { name: 'Productivity', path: '/blog/category/productivity' },
        { name: 'Finance', path: '/blog/category/finance' },
        { name: 'Lifestyle', path: '/blog/category/lifestyle' },
        { name: 'Travel', path: '/blog/category/travel' },
        { name: 'Food', path: '/blog/category/food' },
        { name: 'Health', path: '/blog/category/health' },
        { name: 'Education', path: '/blog/category/education' },
      ]
    },
    {
      name: 'Resources',
      path: '/resources',
      megaMenu: [
        { name: 'Guides', path: '/guides' },
        { name: 'Tutorials', path: '/resources/tutorials' },
        { name: 'Templates', path: '/resources/templates' },
        { name: 'Downloads', path: '/resources/downloads' },
        { name: 'Freebies', path: '/resources/freebies' },
        { name: 'Tools', path: '/resources/tools' },
        { name: 'Checklists', path: '/resources/checklists' },
      ]
    },
  ],
  footer: {
    explore: [
      { name: 'Home', path: '/' },
      { name: 'Articles', path: '/blog' },
      { name: 'Categories', path: '/categories' },
      { name: 'Topics', path: '/topics' },
      { name: 'Authors', path: '/authors' },
      { name: 'Resources', path: '/resources' },
    ],
    company: [
      { name: 'About', path: '/about' },
      { name: 'Contact', path: '/contact' },
      { name: 'Careers', path: '/careers' },
      { name: 'Press', path: '/press' },
      { name: 'Partners', path: '/partners' },
    ],
    support: [
      { name: 'Help Center', path: '/help' },
      { name: 'Documentation', path: '/docs' },
      { name: 'FAQ', path: '/faq' },
      { name: 'Report Issue', path: '/contact?subject=issue' },
      { name: 'Status', path: '/status' },
    ],
    legal: [
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Terms of Service', path: '/terms' },
      { name: 'Cookie Policy', path: '/cookie-policy' },
      { name: 'Accessibility', path: '/accessibility' },
      { name: 'Licenses', path: '/licenses' },
    ]
  }
};
