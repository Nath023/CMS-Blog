export const siteConfig = {
  name: "SaaS Boilerplate",
  description: "Practical web design, SEO, and digital marketing insights for forward-thinking businesses.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.com",
  ogImage: "/og-default.jpg",
  author: "Author Name",
  links: {
    twitter: "https://twitter.com/your-handle",
    github: "https://github.com/your-repo",
  },
  contact: {
    email: "info@example.com",
  },
  company: {
    name: "SaaS Boilerplate",
    foundedDate: "2026",
  },
  authorBio: {
    name: 'SaaS Boilerplate',
    bio: 'We are a digital agency specializing in modern web development, SEO, and marketing strategies. We help businesses grow their online presence with cutting-edge technology.',
    socialLink: 'https://example.com',
    imageUrl: '/og-default.jpg'
  }
};

export type SiteConfig = typeof siteConfig;
