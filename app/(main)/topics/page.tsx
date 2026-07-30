import { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { StaticPageContent } from '@/components/StaticPageContent';
import { getSettings } from '@/lib/fetch';

export const metadata: Metadata = {
  title: `Topics | ${siteConfig.name}`,
  description: `Topics for ${siteConfig.name}.`,
};

export default async function Page() {
  const settings = await getSettings();
  const content = settings[`page_topics`];
  
  return <StaticPageContent content={content} defaultTitle="Topics" />;
}
