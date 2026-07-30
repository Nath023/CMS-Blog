import { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: `Terms of Service for ${siteConfig.name}.`,
};

export default function TermsOfServicePage() {
  return (
    <main className="flex-1 w-full bg-slate-50 dark:bg-[#050505] min-h-screen pt-24 lg:pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 lg:p-16 shadow-sm">
          <header className="mb-12 border-b border-slate-100 dark:border-slate-800 pb-8">
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mb-4">
              Terms of Service
            </h1>
            <p className="text-slate-500 dark:text-slate-400" suppressHydrationWarning>
              Last updated: Jul 20, 2026
            </p>
          </header>

          <div className="prose prose-slate dark:prose-invert prose-lg max-w-none">
            <p>
              Welcome to <strong>{siteConfig.name}</strong>. These Terms of Service (&quot;Terms&quot;) govern your access to and use of our website, 
              services, and applications. By accessing or using our services, you agree to be bound by these Terms and our Privacy Policy.
            </p>

            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing our website and using our services, you accept and agree to be bound by the terms and provision of this agreement. 
              In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services. 
              Any participation in this service will constitute acceptance of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>

            <h2>2. Provision of Services</h2>
            <p>
              {siteConfig.company.name} is constantly innovating in order to provide the best possible experience for its users. 
              You acknowledge and agree that the form and nature of the services which {siteConfig.company.name} provides may change from time to time without prior notice to you.
            </p>

            <h2>3. Use of the Website</h2>
            <p>You agree to use the website only for purposes that are permitted by:</p>
            <ul>
              <li>The Terms.</li>
              <li>Any applicable law, regulation, or generally accepted practices or guidelines in the relevant jurisdictions (including Nigerian digital laws).</li>
            </ul>
            <p>
              You agree that you will not engage in any activity that interferes with or disrupts the website or the servers and networks which are connected to the website.
            </p>

            <h2>4. Intellectual Property</h2>
            <p>
              All content included on this site, such as text, graphics, logos, button icons, images, audio clips, digital downloads, data compilations, 
              and software, is the property of {siteConfig.company.name} or its content suppliers and protected by international copyright laws.
            </p>

            <h2>5. Disclaimer of Warranties</h2>
            <p>
              The materials on {siteConfig.company.name}&apos;s website are provided on an &apos;as is&apos; basis. {siteConfig.company.name} makes no warranties, 
              expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, 
              fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>

            <h2>6. Limitation of Liability</h2>
            <p>
              In no event shall {siteConfig.company.name} or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, 
              or due to business interruption) arising out of the use or inability to use the materials on {siteConfig.company.name}&apos;s website, 
              even if {siteConfig.company.name} or an authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>

            <h2>7. Governing Law</h2>
            <p>
              These Terms shall be governed and construed in accordance with the laws of the Federal Republic of Nigeria, without regard to its conflict of law provisions. 
              Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
            </p>

            <h2>8. Changes to Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at our sole discretion. 
              By continuing to access or use our service after those revisions become effective, you agree to be bound by the revised terms.
            </p>

            <h2>9. Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us at:</p>
            <p>
              <strong>{siteConfig.company.name}</strong><br />
              Email: <a href={`mailto:${siteConfig.contact.email}`} className="text-primary hover:underline">{siteConfig.contact.email}</a><br />
              Website: <Link href="/" className="text-primary hover:underline">{siteConfig.url.replace(/^https?:\/\//, '')}</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
