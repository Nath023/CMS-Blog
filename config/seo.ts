import { siteConfig } from './site';
import type { Metadata } from 'next';

export const seoConfig = {
  defaultTitle: `Blog | ${siteConfig.name}`,
  titleTemplate: `%s | ${siteConfig.name}`,
  description: siteConfig.description,
  ogImage: "/dummy.jpg",
  twitterCard: 'summary_large_image',
  locale: 'en_US',
};

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: seoConfig.defaultTitle,
    template: seoConfig.titleTemplate,
  },
  description: seoConfig.description,
  openGraph: {
    title: `${siteConfig.name} Blog`,
    description: seoConfig.description,
    url: '/',
    siteName: siteConfig.name,
    locale: seoConfig.locale,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} Blog`,
    description: seoConfig.description,
  },
};
