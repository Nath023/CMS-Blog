'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { deleteSubscriber } from '@/app/admin/subscribers/actions';
import { Search, Download, Trash2, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function SubscribersTable({ initialSubscribers }: { initialSubscribers: any[] }) {
  const router = useRouter();
  const [subscribers, setSubscribers] = useState(initialSubscribers);
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    setSubscribers(initialSubscribers);
  }, [initialSubscribers]);
  const [exporting, setExporting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this subscriber?')) {
      setLoading(id);
      setSubscribers(prev => prev.filter(s => s.id !== id));
      const res = await deleteSubscriber(id);
      if (res?.error) {
        alert(res.error);
        setSubscribers(initialSubscribers);
      } else {
        router.refresh();
      }
      setLoading(null);
    }
  };

  const handleExport = () => {
    setExporting(true);
    try {
      const headers = ['Email', 'First Name', 'Status', 'Source', 'Joined At'];
      const rows = filteredSubscribers.map(s => [
        s.email || '',
        s.first_name || '',
        s.status || '',
        s.source || '',
        new Date(s.created_at).toISOString()
      ]);
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `subscribers-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export CSV', err);
      alert('Failed to export CSV');
    }
    setExporting(false);
  };

  const filteredSubscribers = subscribers?.filter((sub) => 
    sub.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.first_name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Subscribers</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your newsletter audience.</p>
        </div>
        <div className="flex flex-col sm:flex-row w-full sm:w-auto items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search subscribers..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 dark:text-slate-100"
            />
          </div>
          <Button variant="outline" onClick={handleExport} disabled={exporting} className="w-full sm:w-auto flex items-center gap-2">
            <Download className="w-4 h-4" />
            {exporting ? 'Exporting...' : 'Export'}
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl md:rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-950/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Subscriber</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Source</th>
                <th className="px-6 py-4 font-semibold">Date Added</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {filteredSubscribers.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-50 dark:hover:bg-slate-950/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary hidden sm:flex items-center justify-center shrink-0">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-slate-100">{sub.email}</div>
                        {sub.first_name && <div className="text-xs text-slate-500">{sub.first_name}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md font-medium uppercase tracking-wider text-[10px] inline-flex items-center gap-1.5 ${sub.status === 'active' ? 'bg-emerald-100/50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${sub.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                    {sub.source === 'lead_magnet' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 text-xs font-medium border border-blue-100 dark:border-blue-800">Lead Magnet</span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400 text-xs font-medium border border-purple-100 dark:border-purple-800">Newsletter</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                    {sub.created_at.split('T')[0]}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDelete(sub.id)}
                      disabled={loading === sub.id}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 disabled:opacity-50"
                      title="Delete Subscriber"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredSubscribers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
                      <Mail className="w-12 h-12 mb-4 opacity-20" />
                      <p className="text-lg font-medium text-slate-900 dark:text-slate-100">No subscribers found</p>
                      <p className="text-sm mt-1">{searchTerm ? 'Try adjusting your search query' : 'Your subscriber list is currently empty.'}</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
