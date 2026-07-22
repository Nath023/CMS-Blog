import { createClient } from '@/lib/supabase/server';
import { CategoryForm } from '@/components/admin/CategoryForm';
import NotFound from '@/app/not-found';

export default async function EditCategoryPage(props: { params: { id: string } }) {
  const params = props.params;
  const id = params.id;
  const supabase = createClient();

  let category = null;
  try {
    const { data } = await supabase.from('categories').select('*').eq('id', id).single();
    category = data;
  } catch (e) {
    console.error('Error fetching category:', e);
  }

  if (!category) {
    return <NotFound />;
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">Edit Category</h1>
        <p className="text-slate-500 dark:text-slate-400">Update category details.</p>
      </div>
      <CategoryForm category={category} />
    </div>
  );
}
