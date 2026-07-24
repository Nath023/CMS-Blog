export default function Loading() {
  return (
    <div className="flex flex-col gap-8 animate-pulse">
      <div className="h-12 w-64 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
      <div className="h-96 w-full bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>
    </div>
  );
}
