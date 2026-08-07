import { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `Privacy Policy for ${siteConfig.name}, compliant with Data Protection laws.`,
};

export default function PrivacyPolicyPage() {
  return (
    <main className="flex-1 w-full bg-slate-50 dark:bg-[#050505] min-h-screen pt-36 lg:pt-48 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 lg:p-16 shadow-sm">
          <header className="mb-12 border-b border-slate-100 dark:border-slate-800 pb-8">
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mb-4">
              Privacy Policy
            </h1>
            <p className="text-slate-500 dark:text-slate-400" suppressHydrationWarning>
              Last updated: Jul 20, 2026
            </p>
          </header>

          <div className="prose prose-slate dark:prose-invert prose-lg max-w-none">
            <p>
              At <strong>{siteConfig.company.name}</strong>, we respect your privacy and are committed to protecting your personal data. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
            </p>
            
            <p>
              This policy is designed to comply with the <strong>Nigeria Data Protection Act (NDPA) 2023</strong>, the <strong>Nigeria Data Protection Regulation (NDPR) 2019</strong>, 
              and other applicable digital and privacy laws in Nigeria.
            </p>

            <h2>1. Information We Collect</h2>
            <p>We may collect several types of information from and about users of our website, including:</p>
            <ul>
              <li><strong>Personal Data:</strong> Name, email address, phone number, and company details when you fill out forms, subscribe to our newsletter, or contact us.</li>
              <li><strong>Usage Data:</strong> Information about your interaction with our website, such as IP addresses, browser types, operating systems, and pages visited, collected automatically via cookies and tracking technologies.</li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect for various purposes, including:</p>
            <ul>
              <li>To provide, maintain, and improve our services.</li>
              <li>To communicate with you, including responding to inquiries and sending newsletters (which you can opt out of at any time).</li>
              <li>To analyze website usage and improve user experience.</li>
              <li>To comply with legal obligations and enforce our terms and conditions.</li>
            </ul>

            <h2>3. Legal Basis for Processing (NDPA Compliance)</h2>
            <p>Under Nigerian data protection laws, we process your personal data based on one or more of the following lawful bases:</p>
            <ul>
              <li><strong>Consent:</strong> You have given explicit consent for one or more specific purposes (e.g., subscribing to our newsletter).</li>
              <li><strong>Contract:</strong> Processing is necessary for the performance of a contract with you or to take steps at your request before entering into a contract.</li>
              <li><strong>Legal Obligation:</strong> Processing is necessary for compliance with a legal obligation to which we are subject.</li>
              <li><strong>Legitimate Interests:</strong> Processing is necessary for our legitimate business interests, provided those interests do not override your fundamental rights and freedoms.</li>
            </ul>

            <h2>4. Data Sharing and Third Parties</h2>
            <p>
              We do not sell, rent, or trade your personal data to third parties. We may share your information with trusted third-party service providers 
              who assist us in operating our website, conducting our business, or serving our users (e.g., hosting providers, analytics services, email delivery systems). 
              These third parties are bound by confidentiality agreements and are required to comply with NDPA standards.
            </p>

            <h2>5. Your Data Protection Rights</h2>
            <p>In accordance with the NDPA and NDPR, you have the following rights regarding your personal data:</p>
            <ul>
              <li><strong>Right to Access:</strong> You can request copies of your personal data held by us.</li>
              <li><strong>Right to Rectification:</strong> You can request that we correct any inaccurate or incomplete personal data.</li>
              <li><strong>Right to Erasure:</strong> You can request that we erase your personal data, under certain conditions.</li>
              <li><strong>Right to Restrict Processing:</strong> You can request that we restrict the processing of your personal data, under certain conditions.</li>
              <li><strong>Right to Object:</strong> You can object to our processing of your personal data, including for direct marketing purposes.</li>
              <li><strong>Right to Data Portability:</strong> You can request that we transfer the data we have collected to another organization, or directly to you.</li>
            </ul>
            <p>To exercise any of these rights, please contact us using the information provided below.</p>

            <h2>6. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal data against accidental or unlawful destruction, 
              loss, alteration, unauthorized disclosure, or access. However, please note that no method of transmission over the internet or electronic storage is 100% secure.
            </p>

            <h2>7. Data Retention</h2>
            <p>
              We retain your personal data only for as long as necessary to fulfill the purposes for which it was collected, including for the purposes 
              of satisfying any legal, accounting, or reporting requirements.
            </p>

            <h2>8. International Data Transfers</h2>
            <p>
              If we transfer your personal data to countries outside Nigeria, we ensure that such transfers comply with the NDPA and NDPR requirements, 
              such as ensuring the destination country has adequate data protection laws or using standard contractual clauses approved by the Nigeria Data Protection Commission (NDPC).
            </p>

            <h2>9. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices or relevant laws. We will notify you of any significant changes 
              by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
            </p>

            <h2>10. Contact Us</h2>
            <p>If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:</p>
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
