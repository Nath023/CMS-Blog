import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getSettings } from '@/lib/fetch';

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();

  return (
    <>
      {/* @ts-expect-error Async Server Component */}
      <Header settings={settings} />
      {children}
      <Footer />
    </>
  );
}
