'use client';

export function SEOAssistant({
  title,
  excerpt,
  content,
  metaTitle,
  metaDescription,
  slug,
  imageUrl
}: {
  title: string;
  excerpt: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  slug: string;
  imageUrl: string;
}) {
  const warnings: string[] = [];
  const good: string[] = [];
  
  const displayTitle = metaTitle || title;
  const displayDesc = metaDescription || excerpt;

  if (displayTitle.length === 0) {
    warnings.push("Title is missing.");
  } else if (displayTitle.length < 50) {
    warnings.push(`Title is too short (${displayTitle.length}/50-60 chars).`);
  } else if (displayTitle.length > 60) {
    warnings.push(`Title is too long (${displayTitle.length}/50-60 chars).`);
  } else {
    good.push(`Title length is optimal (${displayTitle.length} chars).`);
  }

  if (displayDesc.length === 0) {
    warnings.push("Meta description is missing.");
  } else if (displayDesc.length < 150) {
    warnings.push(`Meta description is too short (${displayDesc.length}/150-160 chars).`);
  } else if (displayDesc.length > 160) {
    warnings.push(`Meta description is too long (${displayDesc.length}/150-160 chars).`);
  } else {
    good.push(`Meta description length is optimal (${displayDesc.length} chars).`);
  }

  const wordCount = content.trim().split(/\s+/).filter(w => w.length > 0).length;
  if (wordCount === 0) {
    warnings.push("Content is missing.");
  } else if (wordCount < 300) {
    warnings.push(`Content is too short (${wordCount} words). Aim for at least 300 words.`);
  } else {
    good.push(`Content length is good (${wordCount} words).`);
  }

  if (!imageUrl) {
    warnings.push("Featured image is missing.");
  } else {
    good.push("Featured image is set.");
  }

  const score = Math.max(0, 100 - (warnings.length * 25));

  return (
    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg">SEO Assistant</h3>
        <div className={`px-3 py-1 rounded-full text-sm font-bold ${score >= 80 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : score >= 50 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
          Score: {score}/100
        </div>
      </div>
      
      <div className="space-y-6 flex-1">
        {warnings.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Needs Improvement</h4>
            <ul className="space-y-2">
              {warnings.map((w, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <span className="text-red-500 font-bold shrink-0">✕</span> 
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {good.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Good Results</h4>
            <ul className="space-y-2">
              {good.map((g, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <span className="text-emerald-500 font-bold shrink-0">✓</span> 
                  <span>{g}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      {warnings.length > 0 && (
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-amber-600 dark:text-amber-500 font-medium">
          ⚠️ Publishing with low SEO score may affect search rankings.
        </div>
      )}
    </div>
  );
}
