import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FAFAFA] dark:bg-[#050505] text-center px-4">
      <div className="max-w-md w-full">
        <h1 className="text-9xl font-serif text-slate-200 dark:text-slate-800 font-bold mb-4">404</h1>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          Page Not Found
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <Link 
          href="/" 
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
