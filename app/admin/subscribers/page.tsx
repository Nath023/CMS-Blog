import { getSubscribersAdmin } from '@/lib/database';
import { SubscribersTable } from '@/components/admin/SubscribersTable';

export const dynamic = 'force-dynamic';

export default async function AdminSubscribersPage() {

  
  const subscribers = await getSubscribersAdmin();

  return <SubscribersTable initialSubscribers={subscribers || []} />;
}
