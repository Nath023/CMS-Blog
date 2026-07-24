import { featuresConfig } from '@/config/features';

export function Analytics() {
  if (!featuresConfig.enableAnalytics) return null;

  return (
    <>
      {/* 
        Add your analytics script here (e.g., Google Analytics, Vercel Analytics, Plausible).
        Example for Google Analytics:
        <script async src="https://www.googletagmanager.com/gtag/js?id=YOUR-GA-ID"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'YOUR-GA-ID');
          `
        }} />
      */}
    </>
  );
}
