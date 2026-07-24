import { env } from '@/config/env';

export const siteConfig = {
  name: "SaaS Boilerplate",
  description: "A modern SaaS boilerplate for forward-thinking businesses. Build faster and scale better.",
  url: env.NEXT_PUBLIC_APP_URL || "https://your-domain.com",
  contact: {
    email: "hello@example.com",
  },
  company: {
    name: "SaaS Boilerplate Inc.",
    foundedDate: "2026",
  },
  authorBio: {
    name: 'Admin User',
    bio: 'This is a generic author bio. Replace this text with your own author biography in the configuration file.',
    socialLink: 'https://example.com',
    imageUrl: '/dummy.jpg'
  }
};

export type SiteConfig = typeof siteConfig;
