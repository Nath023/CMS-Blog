'use server';

import { createAdminClient } from '@/lib/supabase/server';
import { sendWelcomeEmail, sendLeadMagnetEmail } from '@/lib/email/resend';

export async function subscribeToNewsletter(formData: FormData) {
  try {
    const supabase = createAdminClient();
    
    // Check honeypot
    const honeypot = formData.get('b_name');
    if (honeypot) {
      // Silent rejection
      return { success: 'Thanks for subscribing!' };
    }
    
    const email = formData.get('email') as string;
    const first_name = formData.get('first_name') as string;
    const source = formData.get('source') as string;
    const post_id = formData.get('post_id') as string;
    
    if (!email) {
      return { error: 'Email is required' };
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { error: 'Invalid email format' };
    }

    const { data: existing } = await supabase
      .from('subscribers')
      .select('id, status')
      .eq('email', email)
      .single();

    if (existing) {
      if (existing.status === 'unsubscribed') {
        // Resubscribe
        const { error } = await supabase
          .from('subscribers')
          .update({ status: 'active', consent_given: true, updated_at: new Date().toISOString() })
          .eq('email', email);
          
        if (error) throw error;
        
        // Don't send welcome email again for resubscribes, but we could if we wanted.
        return { success: 'Welcome back! You have been resubscribed.' };
      }
      return { success: 'You are already subscribed!' }; // Don't show error to user for this
    }

    const { error } = await supabase.from('subscribers').insert({
      email,
      first_name: first_name || null,
      source: source || 'website',
      post_id: post_id || null,
      consent_given: true,
      status: 'active'
    });

    if (error) {
      return { error: error.message };
    }
    
    // Check if this was from a lead magnet
    if (source.startsWith('magnet_')) {
      const magnetId = source.replace('magnet_', '');
      const { data: magnet } = await supabase
        .from('lead_magnets')
        .select('title, file_url, is_active')
        .eq('id', magnetId)
        .single();
        
      if (magnet && magnet.is_active && magnet.file_url) {
        // Increment download count
        await supabase.rpc('increment_download_count', { row_id: magnetId });
        
        // Send email with resource
        await sendLeadMagnetEmail(email, magnet.title, magnet.file_url, first_name);
        return { success: 'Thanks! Check your email for the download link.' };
      }
    }

    // Default welcome email
    await sendWelcomeEmail(email, first_name);

    return { success: 'Thanks for subscribing!' };
  } catch (err: any) {
    console.error(err);
    return { error: err.message || 'Failed to subscribe.' };
  }
}

