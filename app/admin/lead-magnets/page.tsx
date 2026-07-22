import { createAdminClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminLeadMagnetsPage() {
  const supabase = createAdminClient();
  
  const { data: magnets } = await supabase
    .from('lead_magnets')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="flex flex-col gap-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">Lead Magnets</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage downloadable resources.</p>
      </div>
      <div className="flex items-center justify-between">
        <div />
        <Link 
          href="/admin/lead-magnets/new"
          className="bg-blue-600 text-white hover:bg-blue-700 shadow-sm inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors h-10 py-2 px-4"
        >
          Create New
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-950/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Title</th>
                <th className="px-6 py-4 font-semibold">Downloads</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {magnets?.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-950/50 transition-colors group">
                  <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100">{m.title}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{m.download_count || 0}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md font-medium uppercase tracking-wider text-[10px] ${m.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>{m.is_active ? 'Active' : 'Inactive'}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{m.created_at.split('T')[0]}</td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/lead-magnets/${m.id}`} className="text-sm font-medium text-primary hover:underline">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
              {(!magnets || magnets.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">No lead magnets found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
