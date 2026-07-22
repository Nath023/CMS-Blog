import { createAdminClient } from '@/lib/supabase/server';
import { SubscribersTable } from '@/components/admin/SubscribersTable';

export const dynamic = 'force-dynamic';

export default async function AdminSubscribersPage() {
  const supabase = createAdminClient();
  
  const { data: subscribers } = await supabase
    .from('subscribers')
    .select('*')
    .order('created_at', { ascending: false });

  return <SubscribersTable initialSubscribers={subscribers || []} />;
}
