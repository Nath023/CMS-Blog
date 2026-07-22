import { CategoryForm } from '@/components/admin/CategoryForm';

export default function NewCategoryPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">Add Category</h1>
        <p className="text-slate-500 dark:text-slate-400">Create a new blog category.</p>
      </div>
      <CategoryForm />
    </div>
  );
}
