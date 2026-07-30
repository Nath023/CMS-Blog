import { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { RevealWrapper } from '@/components/RevealWrapper';
import { Mail, MapPin, Phone } from 'lucide-react';

export const metadata: Metadata = {
  title: `Contact Us | ${siteConfig.name}`,
  description: `Get in touch with the ${siteConfig.name} team.`,
};

export default function ContactPage() {
  return (
    <div className="flex-1 w-full bg-slate-50 dark:bg-slate-950/50 min-h-screen relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 md:pt-32 md:pb-24">
        
        <RevealWrapper className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-[1.1] mb-6">
            Contact Us
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            We&apos;d love to hear from you! Whether you have a question, feedback, or just want to say hello, feel free to reach out.
          </p>
        </RevealWrapper>

        <RevealWrapper delay={0.1} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">Get In Touch</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-8">
                Fill out the form or use our contact information to connect with our team directly.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4 text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors">
                  <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-full">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="pt-2">
                    <p className="font-semibold text-slate-900 dark:text-slate-100">Email</p>
                    <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>
                  </div>
                </div>

                <div className="flex items-start gap-4 text-slate-600 dark:text-slate-400">
                  <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-full">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="pt-2">
                    <p className="font-semibold text-slate-900 dark:text-slate-100">Location</p>
                    <p>Global Remote</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Simple Contact Form Template (UI only) */}
            <div>
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Name</label>
                  <input type="text" id="name" className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Your name" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email</label>
                  <input type="email" id="email" className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="your@email.com" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Message</label>
                  <textarea id="message" rows={4} className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="How can we help you?"></textarea>
                </div>
                <button type="button" className="w-full bg-primary text-primary-foreground font-semibold py-3 px-6 rounded-xl hover:bg-primary/90 transition-colors">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </RevealWrapper>
      </div>
    </div>
  );
}
