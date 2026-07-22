import { TagForm } from '@/components/admin/TagForm';

export default function NewTagPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">Add Tag</h1>
        <p className="text-slate-500 dark:text-slate-400">Create a new blog tag.</p>
      </div>
      <TagForm />
    </div>
  );
}
