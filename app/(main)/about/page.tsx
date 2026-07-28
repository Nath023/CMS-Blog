import { Metadata } from 'next';
import Image from 'next/image';
import { siteConfig } from '@/config/site';
import { aboutConfig } from '@/config/about';
import { RevealWrapper } from '@/components/RevealWrapper';

export const metadata: Metadata = {
  title: `About Us | ${siteConfig.name}`,
  description: `Learn more about ${siteConfig.name} and our mission.`,
};

export default function AboutPage() {
  return (
    <div className="flex-1 w-full bg-slate-50 dark:bg-slate-950/50 min-h-screen relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        
        {/* Header Section */}
        <RevealWrapper className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-[1.1] mb-6">
            About Us
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400">
            Welcome to {siteConfig.name}. We are dedicated to providing the best content and resources for forward-thinking businesses.
          </p>
        </RevealWrapper>

        <div className="space-y-20">
          
          {/* Mission Section */}
          <RevealWrapper delay={0.1} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 shadow-sm text-center">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              {aboutConfig.mission.title}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
              {aboutConfig.mission.description}
            </p>
          </RevealWrapper>

          {/* Values Section */}
          <div className="max-w-5xl mx-auto">
            <RevealWrapper delay={0.2} className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                {aboutConfig.values.title}
              </h2>
            </RevealWrapper>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {aboutConfig.values.items.map((item, index) => (
                <RevealWrapper key={item.title} delay={0.3 + index * 0.1} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm transition-transform hover:-translate-y-1">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">{item.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.description}</p>
                </RevealWrapper>
              ))}
            </div>
          </div>

          {/* Team Section */}
          <div className="max-w-6xl mx-auto">
            <RevealWrapper delay={0.2} className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                {aboutConfig.team.title}
              </h2>
            </RevealWrapper>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {aboutConfig.team.members.map((member, index) => (
                <RevealWrapper key={member.name} delay={0.3 + index * 0.1} className="flex flex-col items-center text-center">
                  <div className="relative w-40 h-40 mb-6 overflow-hidden rounded-full border-4 border-white dark:border-slate-900 shadow-md">
                    <Image
                      src={member.imageUrl}
                      alt={member.name}
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">{member.name}</h3>
                  <p className="text-sm font-semibold text-primary mb-4">{member.role}</p>
                  <p className="text-slate-600 dark:text-slate-400 max-w-sm">{member.bio}</p>
                </RevealWrapper>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
