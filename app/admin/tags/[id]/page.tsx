import { getTagById } from '@/lib/database';
import { TagForm } from '@/components/admin/TagForm';
import NotFound from '@/app/not-found';

export default async function EditTagPage(props: { params: { id: string } }) {
  const params = props.params;
  const id = params.id;
  const tag = await getTagById(id);

  if (!tag) {
    return <NotFound />;
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">Edit Tag</h1>
        <p className="text-slate-500 dark:text-slate-400">Update tag details.</p>
      </div>
      <TagForm tag={tag} />
    </div>
  );
}
