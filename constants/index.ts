export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
} as const;

export const POST_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
} as const;

export const SUBSCRIBER_STATUS = {
  ACTIVE: 'active',
  UNSUBSCRIBED: 'unsubscribed',
} as const;

export const ROUTES = {
  HOME: '/',
  BLOG: '/blog',
  GUIDES: '/guides',
  CONTACT: '/contact',
  ADMIN: {
    DASHBOARD: '/admin',
    POSTS: '/admin/posts',
    CATEGORIES: '/admin/categories',
    TAGS: '/admin/tags',
    SUBSCRIBERS: '/admin/subscribers',
    LEAD_MAGNETS: '/admin/lead-magnets',
    MEDIA: '/admin/media',
    SETTINGS: '/admin/settings',
    LOGIN: '/admin/login',
  },
} as const;

export const BUCKETS = {
  BLOG_IMAGES: 'blog-images',
  LEAD_MAGNETS: 'lead-magnets',
} as const;

export const LIMITS = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_UPLOAD_SIZE_MB: 5,
  DASHBOARD_RECENT_POSTS: 5,
  SIDEBAR_POPULAR_POSTS: 3,
} as const;
