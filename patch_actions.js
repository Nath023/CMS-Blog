const fs = require('fs');

function appendAction(file, content) {
  if (fs.existsSync(file)) {
    let code = fs.readFileSync(file, 'utf8');
    if (!code.includes(content.split('(')[0])) {
      code += '\n' + content;
      fs.writeFileSync(file, code);
    }
  } else {
    fs.writeFileSync(file, "'use server';\nimport { revalidatePath } from 'next/cache';\n" + content);
  }
}

// Categories
appendAction('app/admin/categories/actions.ts', `
export async function bulkDeleteCategories(ids: string[]) {
  for (const id of ids) {
    await deleteCategory(id);
  }
  revalidatePath('/admin/categories');
  return { success: true };
}
`);

// Tags
appendAction('app/admin/tags/actions.ts', `
export async function bulkDeleteTags(ids: string[]) {
  for (const id of ids) {
    await deleteTag(id);
  }
  revalidatePath('/admin/tags');
  return { success: true };
}
`);

// Posts
appendAction('app/admin/posts/actions.ts', `
'use server';
import { deletePost, updatePost } from '@/lib/database';
import { revalidatePath } from 'next/cache';

export async function bulkDeletePosts(ids: string[]) {
  for (const id of ids) {
    await deletePost(id);
  }
  revalidatePath('/admin/posts');
  return { success: true };
}

export async function bulkUpdatePostStatus(ids: string[], status: string) {
  for (const id of ids) {
    await updatePost(id, { status });
  }
  revalidatePath('/admin/posts');
  return { success: true };
}
`);

