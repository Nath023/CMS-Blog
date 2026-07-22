'use server';

import { createAdminClient } from '@/lib/supabase/server';
import { sendWelcomeEmail, sendLeadMagnetEmail } from '@/lib/email/resend';

export async function downloadLeadMagnet(formData: FormData) {
  try {
    const supabase = createAdminClient();
    
    // Check honeypot
    const honeypot = formData.get('b_name');
    if (honeypot) {
      // Silent rejection
      return { success: true, message: 'Download ready! We have also emailed you the link.' };
    }
    
    const email = formData.get('email') as string;
    const first_name = formData.get('first_name') as string;
    const lead_magnet_id = formData.get('lead_magnet_id') as string;
    const post_id = formData.get('post_id') as string;
    
    if (!email || !lead_magnet_id) {
      return { error: 'Email and lead magnet ID are required' };
    }

    // Subscribe user or update existing
    let subscriberId = null;
    let isNewSub = false;

    const { data: existingSub } = await supabase
      .from('subscribers')
      .select('id')
      .eq('email', email)
      .single();

    if (existingSub) {
      subscriberId = existingSub.id;
      // ensure active
      await supabase.from('subscribers').update({ status: 'active' }).eq('id', subscriberId);
    } else {
      isNewSub = true;
      const { data: newSub } = await supabase.from('subscribers').insert({
        email,
        first_name: first_name || null,
        source: `magnet_${lead_magnet_id}`,
        post_id: post_id || null,
        consent_given: true,
        status: 'active'
      }).select('id').single();
      
      if (newSub) subscriberId = newSub.id;
    }

    // Record download
    await supabase.from('lead_magnet_downloads').insert({
      lead_magnet_id,
      subscriber_id: subscriberId,
      email,
      first_name: first_name || null,
      source_post_id: post_id || null
    });

    // Increment download count and get file_url
    const { data: magnet } = await supabase.from('lead_magnets').select('title, download_count, file_url, success_message').eq('id', lead_magnet_id).single();
    
    if (magnet) {
      await supabase.from('lead_magnets').update({ download_count: (magnet.download_count || 0) + 1 }).eq('id', lead_magnet_id);
      
      if (magnet.file_url) {
        await sendLeadMagnetEmail(email, magnet.title, magnet.file_url, first_name);
      }
    }

    // If new subscriber, optionally send welcome email too?
    // We can just send the lead magnet email which can act as a welcome email too.
    
    return { 
      success: true, 
      file_url: magnet?.file_url || null, 
      message: magnet?.success_message || 'Download ready! We have also emailed you the link.' 
    };
  } catch (err: any) {
    console.error(err);
    return { error: err.message || 'Failed to process download.' };
  }
}

