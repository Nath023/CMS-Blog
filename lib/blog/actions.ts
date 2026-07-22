'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { sendBlogPostEmail } from '@/lib/email/resend';

export async function createPost(formData: FormData) {
  try {
    const supabase = await createClient();
    
    const title = formData.get('title') as string;
    let slug = formData.get('slug') as string;
    const excerpt = formData.get('excerpt') as string;
    const content = formData.get('content') as string;
    const author_name = formData.get('author_name') as string;
    const category_id = formData.get('category_id') as string;
    const status = formData.get('status') as string;
    const featured_image_url = formData.get('featured_image_url') as string;
    const meta_title = formData.get('meta_title') as string;
    const meta_description = formData.get('meta_description') as string;
    const tagsStr = formData.get('tags') as string;

    // Auto-generate slug if empty
    if (!slug) {
      slug = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
    }

    // Check duplicate slug
    const { data: existing } = await supabase.from('posts').select('id').eq('slug', slug).single();
    if (existing) {
      return { error: 'A post with this slug already exists. Please choose a different slug.' };
    }

    let published_at: string | null = null;
    if (status === 'published') {
      published_at = new Date().toISOString();
    } else if (status === 'draft') {
      const scheduledAt = formData.get('scheduled_at') as string;
      if (scheduledAt) {
        published_at = new Date(scheduledAt).toISOString();
      }
    }

    const { data: post, error } = await supabase.from('posts').insert({
      title,
      slug,
      excerpt,
      content,
      category_id: category_id || null,
      author_name: author_name || null,
      status: status as any,
      featured_image_url: featured_image_url || null,
      meta_title: meta_title || null,
      meta_description: meta_description || null,
      published_at
    }).select().single();

    if (error) {
      return { error: error.message };
    }

    await handleTags(supabase, post.id, tagsStr);
    
    // Send email to subscribers if published
    if (status === 'published') {
      const { data: subscribers } = await supabase.from('newsletter_subscribers').select('email').eq('status', 'active');
      if (subscribers && subscribers.length > 0) {
        const emails = subscribers.map(s => s.email);
        // We don't await this so it happens in the background
        sendBlogPostEmail(emails, title, excerpt, slug, featured_image_url || null).catch(console.error);
      }
    }
  } catch (err: any) {
    console.error(err);
    const msg = err.message || '';
    if (msg.includes('fetch failed') || msg.includes('Failed to fetch')) {
      return { error: 'Failed to connect to the database. Please ensure your Supabase environment variables are correctly configured.' };
    }
    return { error: msg || 'Failed to create post.' };
  }

  revalidatePath('/blog');
  revalidatePath('/admin/posts');
  return { success: true };
}

export async function updatePost(id: string, formData: FormData) {
  let slugToRevalidate;
  try {
    const supabase = await createClient();
    
    const title = formData.get('title') as string;
    let slug = formData.get('slug') as string;
    const excerpt = formData.get('excerpt') as string;
    const content = formData.get('content') as string;
    const author_name = formData.get('author_name') as string;
    const category_id = formData.get('category_id') as string;
    const status = formData.get('status') as string;
    const featured_image_url = formData.get('featured_image_url') as string;
    const meta_title = formData.get('meta_title') as string;
    const meta_description = formData.get('meta_description') as string;
    const tagsStr = formData.get('tags') as string;

    if (!slug) {
      slug = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
    }
    slugToRevalidate = slug;

    const { data: existing } = await supabase.from('posts').select('id').eq('slug', slug).neq('id', id).single();
    if (existing) {
      return { error: 'A post with this slug already exists.' };
    }

    const { data: currentPost } = await supabase.from('posts').select('status, published_at').eq('id', id).single();
    
    let published_at = currentPost?.published_at;
    if (status === 'published' && currentPost?.status !== 'published' && !published_at) {
      published_at = new Date().toISOString();
    } else if (status === 'draft') {
      const scheduledAt = formData.get('scheduled_at') as string;
      if (scheduledAt) {
        published_at = new Date(scheduledAt).toISOString();
      } else {
        published_at = null; // Clear scheduled date if not provided
      }
    }

    const { error } = await supabase.from('posts').update({
      title,
      slug,
      excerpt,
      content,
      category_id: category_id || null,
      author_name: author_name || null,
      status: status as any,
      featured_image_url: featured_image_url || null,
      meta_title: meta_title || null,
      meta_description: meta_description || null,
      published_at,
      updated_at: new Date().toISOString()
    }).eq('id', id);

    if (error) {
      return { error: error.message };
    }

    await handleTags(supabase, id, tagsStr);

    // Send email to subscribers if newly published
    if (status === 'published' && currentPost?.status !== 'published') {
      const { data: subscribers } = await supabase.from('newsletter_subscribers').select('email').eq('status', 'active');
      if (subscribers && subscribers.length > 0) {
        const emails = subscribers.map(s => s.email);
        // We don't await this so it happens in the background
        sendBlogPostEmail(emails, title, excerpt, slug, featured_image_url || null).catch(console.error);
      }
    }
  } catch (err: any) {
    console.error(err);
    const msg = err.message || '';
    if (msg.includes('fetch failed') || msg.includes('Failed to fetch')) {
      return { error: 'Failed to connect to the database. Please ensure your Supabase environment variables are correctly configured.' };
    }
    return { error: msg || 'Failed to update post.' };
  }

  revalidatePath('/blog');
  if (slugToRevalidate) revalidatePath(`/blog/${slugToRevalidate}`);
  revalidatePath('/admin/posts');
  return { success: true };
}

export async function deletePost(id: string) {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) {
      return { error: error.message };
    }
  } catch (err: any) {
    console.error(err);
    return { error: err.message || 'Failed to delete post.' };
  }
  
  revalidatePath('/blog');
  revalidatePath('/admin/posts');
  return { success: true };
}

async function handleTags(supabase: any, postId: string, tagsStr: string) {
  // clear existing
  await supabase.from('post_tags').delete().eq('post_id', postId);

  if (!tagsStr.trim()) return;

  const tagNames = tagsStr.split(',').map(t => t.trim()).filter(Boolean);
  
  for (const name of tagNames) {
    const slug = name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
    
    // get or create tag
    let { data: tag } = await supabase.from('tags').select('id').eq('slug', slug).single();
    if (!tag) {
      const { data: newTag } = await supabase.from('tags').insert({ name, slug }).select().single();
      tag = newTag;
    }

    if (tag) {
      await supabase.from('post_tags').insert({ post_id: postId, tag_id: tag.id });
    }
  }
}
