import { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { StaticPageContent } from '@/components/StaticPageContent';
import { getSettings } from '@/lib/fetch';

export const metadata: Metadata = {
  title: `Changelog | ${siteConfig.name}`,
  description: `Changelog for ${siteConfig.name}.`,
};

export default async function Page() {
  const settings = await getSettings();
  const content = settings[`page_changelog`];
  
  return <StaticPageContent content={content} defaultTitle="Changelog" />;
}
