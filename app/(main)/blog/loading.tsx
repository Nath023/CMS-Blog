export default function Loading() {
  return (
    <div className="flex-1 w-full bg-slate-50 dark:bg-slate-950/50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-12 lg:pt-48 lg:pb-20">
         <div className="h-96 w-full bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse mb-16"></div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-64 w-full bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
            ))}
         </div>
      </div>
    </div>
  );
}
