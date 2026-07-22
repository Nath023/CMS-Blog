import Image from 'next/image';
import Link from 'next/link';

interface AuthorBioProps {
  name: string;
  bio?: string | null;
  socialLink?: string | null;
  imageUrl?: string | null;
}

export function AuthorBio({ name, bio, socialLink, imageUrl }: AuthorBioProps) {
  if (!name && !bio) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 sm:p-8 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 my-12">
      <Link href={`/blog/author/${encodeURIComponent(name || 'Unknown')}`} className="shrink-0 relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800 border-2 border-white dark:border-slate-700 shadow-sm hover:ring-2 hover:ring-blue-500 transition-all">
        {imageUrl ? (
          <Image src={imageUrl} alt={name || 'Author'} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-2xl">
            {(name || 'A').charAt(0).toUpperCase()}
          </div>
        )}
      </Link>
      
      <div className="flex-1 text-center sm:text-left">
        <Link href={`/blog/author/${encodeURIComponent(name || 'Unknown')}`} className="hover:underline decoration-blue-500 underline-offset-4">
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">{name}</h3>
        </Link>
        {bio && (
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed mb-4">
            {bio}
          </p>
        )}
        
        {socialLink && (
          <Link 
            href={socialLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-500 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Connect with {name.split(' ')[0]}
          </Link>
        )}
      </div>
    </div>
  );
}
