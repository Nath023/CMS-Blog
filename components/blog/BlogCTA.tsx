import Link from 'next/link';

export function BlogCTA({ className = '' }: { className?: string }) {
  return (
    <div className={`p-8 bg-primary rounded-[2rem] text-white shadow-xl ${className}`}>
      <h4 className="text-2xl font-serif tracking-tight mb-3">Elevate Your Digital Presence</h4>
      <p className="text-sm text-white/90 leading-relaxed mb-6 font-sans">
        Transform your business with high-performing web design and strategic SEO. Partner with our experts to accelerate growth.
      </p>
      <Link 
        href="/contact" 
        className="inline-flex items-center justify-center w-full bg-white text-primary text-sm font-bold tracking-wider uppercase px-6 py-4 rounded-xl hover:bg-gray-50 hover:shadow-md transition-all duration-300"
      >
        Work With Us
      </Link>
    </div>
  );
}
