import { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { StaticPageContent } from '@/components/StaticPageContent';
import { getSettings } from '@/lib/fetch';

export const metadata: Metadata = {
  title: `Tutorials | ${siteConfig.name}`,
  description: `Tutorials for ${siteConfig.name}.`,
};

export default async function Page() {
  const settings = await getSettings();
  const content = settings[`page_tutorials`];
  
  return <StaticPageContent content={content} defaultTitle="Tutorials" />;
}
