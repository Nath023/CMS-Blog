import { Inter, Playfair_Display } from 'next/font/google';
import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Analytics } from '@/components/Analytics';
import { baseMetadata } from '@/app/metadata';
import { getSettings } from '@/lib/fetch';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = baseMetadata;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();
  const themeClass = settings?.color_theme ? `theme-${settings.color_theme}` : 'theme-default';

  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${playfair.variable} ${themeClass}`}>
      <body suppressHydrationWarning className={`font-sans bg-slate-50 text-slate-600 dark:bg-slate-950 dark:text-slate-400 min-h-screen flex flex-col`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
