import { getAdminDashboardStats } from '@/lib/database';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { POST_STATUS, LIMITS } from '@/constants';
import dynamic from 'next/dynamic';

const DashboardCharts = dynamic(
  () => import('@/components/admin/DashboardCharts').then((mod) => mod.DashboardCharts),
  { ssr: false, loading: () => <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse" /> }
);


export default async function AdminDashboard() {
  const { 
    totalPosts, publishedPosts, draftPosts, archivedPosts, totalViews,
    totalSubscribers, activeSubscribers, subscriberData,
    statusData, monthlyData, recentPosts, popularPosts,
    demographics, topSearches
  } = await getAdminDashboardStats();
  
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400">Overview of your blog content.</p>
        </div>
        <Link href="/admin/posts/new">
          <Button>Write New Post</Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
          <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Total Posts</div>
          <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">{totalPosts || 0}</div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
          <div className="text-sm font-medium text-emerald-600 mb-1">Published</div>
          <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">{publishedPosts || 0}</div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
          <div className="text-sm font-medium text-amber-600 mb-1">Drafts</div>
          <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">{draftPosts || 0}</div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/20 dark:to-slate-900">
          <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-1">Total Views</div>
          <div className="text-3xl font-bold text-indigo-900 dark:text-indigo-100">{totalViews || 0}</div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
          <div className="text-sm font-medium text-blue-600 mb-1">Subscribers</div>
          <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">{totalSubscribers || 0}</div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
          <div className="text-sm font-medium text-emerald-600 mb-1">Active Subs</div>
          <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">{activeSubscribers || 0}</div>
        </div>
      </div>

      <DashboardCharts statusData={statusData} monthlyData={monthlyData} subscriberData={subscriberData || []} />

      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden flex flex-col h-full">
          <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-800 dark:text-slate-200">Reader Demographics</h3>
          </div>
          <div className="p-6 grid grid-cols-2 gap-6 flex-1">
            <div>
              <h4 className="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wider">Top Countries</h4>
              <div className="space-y-3">
                {demographics && Object.entries(demographics.countries).sort((a, b) => (b[1] as number) - (a[1] as number)).slice(0, 5).map(([country, count]) => (
                  <div key={country} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{country}</span>
                    <span className="text-sm text-slate-500">{count as number}</span>
                  </div>
                ))}
                {(!demographics || Object.keys(demographics.countries).length === 0) && (
                  <div className="text-sm text-slate-500">No country data yet</div>
                )}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wider">Devices & Referrers</h4>
              <div className="space-y-3">
                {demographics && Object.entries(demographics.devices).map(([device, count]) => (
                  <div key={device} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{device}</span>
                    <span className="text-sm text-slate-500">{count as number}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-3">
                {demographics && Object.entries(demographics.referrers).sort((a, b) => (b[1] as number) - (a[1] as number)).slice(0, 3).map(([ref, count]) => (
                  <div key={ref} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate max-w-[100px]">{ref}</span>
                    <span className="text-sm text-slate-500">{count as number}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden flex flex-col h-full">
          <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-800 dark:text-slate-200">Search Analytics</h3>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800 flex-1">
            <div className="p-4 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Search Term</span>
              <div className="flex gap-4">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider w-16 text-right">Searches</span>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider w-16 text-right">Results</span>
              </div>
            </div>
            {topSearches?.map((s: any, i: number) => (
              <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:bg-slate-950 transition-colors">
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate pr-4">{s.term}</span>
                <div className="flex gap-4 shrink-0">
                  <span className="text-sm text-slate-600 dark:text-slate-400 w-16 text-right font-medium">{s.count}</span>
                  <span className={`text-sm w-16 text-right font-medium ${s.results === 0 ? 'text-red-500' : 'text-slate-600 dark:text-slate-400'}`}>{s.results}</span>
                </div>
              </div>
            ))}
            {(!topSearches || topSearches.length === 0) && (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                No search data yet.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden flex flex-col h-full">
          <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 dark:text-slate-200">Recent Activity</h3>
            <Link href="/admin/posts" className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline">
              View All
            </Link>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800 flex-1">
            {recentPosts?.map(post => (
              <div key={post.id} className="p-6 flex items-center justify-between hover:bg-slate-50 dark:bg-slate-950 transition-colors">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1">{post.title}</h4>
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <span>{post.created_at.split('T')[0]}</span>
                    <span className={`px-2 py-0.5 rounded-md font-medium uppercase tracking-wider text-[10px] ${
                      post.status === 'published' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                      post.status === 'draft' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                      'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}>
                      {post.status}
                    </span>
                  </div>
                </div>
                <Link href={`/admin/posts/${post.id}/edit`}>
                  <Button variant="outline" size="sm">Edit</Button>
                </Link>
              </div>
            ))}
            {(!recentPosts || recentPosts.length === 0) && (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                No posts yet. Get started by writing your first article.
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden flex flex-col h-full">
          <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 dark:text-slate-200">Popular Posts</h3>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800 flex-1">
            {popularPosts?.map((post, i) => (
              <div key={post.id} className="p-6 flex items-center gap-4 hover:bg-slate-50 dark:bg-slate-950 transition-colors">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold text-sm shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1 truncate">{post.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>{post.view_count || 0} views</span>
                  </div>
                </div>
                <Link href={`/admin/posts/${post.id}/edit`}>
                  <Button variant="outline" size="sm">Edit</Button>
                </Link>
              </div>
            ))}
            {(!popularPosts || popularPosts.length === 0) && (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                No popular posts yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
