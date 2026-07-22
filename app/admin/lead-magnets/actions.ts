'use server';

import { createAdminClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createLeadMagnet(formData: FormData) {
  const supabase = createAdminClient();
  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;
  const description = formData.get('description') as string;
  const button_text = formData.get('button_text') as string;
  const success_message = formData.get('success_message') as string;
  const is_active = formData.get('is_active') === 'on';
  
  const file = formData.get('file') as File;
  let file_url = '';
  
  if (file && file.size > 0) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `lead-magnets/${fileName}`;
    
    // Attempt to ensure bucket exists
    await supabase.storage.createBucket('lead-magnets', { public: true });
    
    const { error: uploadError } = await supabase.storage
      .from('lead-magnets')
      .upload(filePath, file);
      
    if (uploadError) {
      console.error('Upload Error:', uploadError);
      return { error: 'Failed to upload file' };
    }
    
    const { data: publicUrlData } = supabase.storage
      .from('lead-magnets')
      .getPublicUrl(filePath);
      
    file_url = publicUrlData.publicUrl;
  }
  
  const { error } = await supabase.from('lead_magnets').insert({
    title,
    slug,
    description,
    button_text,
    success_message,
    file_url,
    is_active
  });
  
  if (error) {
    console.error('Insert Error:', error);
    return { error: error.message };
  }
  
  revalidatePath('/guides'); revalidatePath('/admin/lead-magnets');
  redirect('/admin/lead-magnets');
}

export async function updateLeadMagnet(id: string, formData: FormData) {
  const supabase = createAdminClient();
  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;
  const description = formData.get('description') as string;
  const button_text = formData.get('button_text') as string;
  const success_message = formData.get('success_message') as string;
  const is_active = formData.get('is_active') === 'on';
  
  const updates: any = {
    title,
    slug,
    description,
    button_text,
    success_message,
    is_active,
    updated_at: new Date().toISOString(),
  };

  const file = formData.get('file') as File;
  
  if (file && file.size > 0) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `lead-magnets/${fileName}`;
    
    await supabase.storage.createBucket('lead-magnets', { public: true });
    
    const { error: uploadError } = await supabase.storage
      .from('lead-magnets')
      .upload(filePath, file);
      
    if (uploadError) {
      console.error('Upload Error:', uploadError);
      return { error: 'Failed to upload file' };
    }
    
    const { data: publicUrlData } = supabase.storage
      .from('lead-magnets')
      .getPublicUrl(filePath);
      
    updates.file_url = publicUrlData.publicUrl;
  }
  
  const { error } = await supabase
    .from('lead_magnets')
    .update(updates)
    .eq('id', id);
    
  if (error) {
    console.error('Update Error:', error);
    return { error: error.message };
  }
  
  revalidatePath('/guides'); revalidatePath('/admin/lead-magnets');
  redirect('/admin/lead-magnets');
}

export async function deleteLeadMagnet(id: string) {
  const supabase = createAdminClient();
  
  const { error } = await supabase
    .from('lead_magnets')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error('Delete Error:', error);
    return { error: error.message };
  }
  
  revalidatePath('/guides'); revalidatePath('/admin/lead-magnets');
  redirect('/admin/lead-magnets');
}
