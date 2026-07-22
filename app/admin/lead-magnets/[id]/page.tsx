import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import EditLeadMagnetForm from './EditLeadMagnetForm';

export default async function EditLeadMagnetPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: magnet } = await supabase
    .from('lead_magnets')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!magnet) {
    notFound();
  }

  return <EditLeadMagnetForm magnet={magnet} />;
}
