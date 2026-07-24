import { getLeadMagnetById } from '@/lib/database';
import { notFound } from 'next/navigation';
import EditLeadMagnetForm from './EditLeadMagnetForm';

export default async function EditLeadMagnetPage({ params }: { params: { id: string } }) {
  const magnet = await getLeadMagnetById(params.id);

  if (!magnet) {
    notFound();
  }

  return <EditLeadMagnetForm magnet={magnet} />;
}
