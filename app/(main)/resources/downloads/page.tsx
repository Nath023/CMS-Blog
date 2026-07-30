import { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { StaticPageContent } from '@/components/StaticPageContent';
import { getSettings } from '@/lib/fetch';

export const metadata: Metadata = {
  title: `Downloads | ${siteConfig.name}`,
  description: `Downloads for ${siteConfig.name}.`,
};

export default async function Page() {
  const settings = await getSettings();
  const content = settings[`page_downloads`];
  
  return <StaticPageContent content={content} defaultTitle="Downloads" />;
}
