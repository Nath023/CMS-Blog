'use server';

import { createAdminClient } from '@/lib/supabase/server';

export async function downloadLeadMagnet(formData: FormData) {
  try {
    const supabase = createAdminClient();
    
    // Check honeypot
    const honeypot = formData.get('b_name');
    if (honeypot) {
      // Silent rejection for bots
      return { success: 'Thanks! Your download will begin shortly.' };
    }

    const email = formData.get('email') as string;
    const first_name = formData.get('first_name') as string;
    const lead_magnet_id = formData.get('lead_magnet_id') as string;
    
    if (!email) {
      return { error: 'Email is required' };
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { error: 'Invalid email format' };
    }

    // 1. Check or create subscriber
    let subscriberId = null;
    const { data: existing } = await supabase
      .from('subscribers')
      .select('id, status')
      .eq('email', email)
      .single();

    if (existing) {
      subscriberId = existing.id;
      if (existing.status === 'unsubscribed') {
        await supabase
          .from('subscribers')
          .update({ status: 'active', consent_given: true, updated_at: new Date().toISOString() })
          .eq('email', email);
      }
    } else {
      const { data: newSub, error: subError } = await supabase
        .from('subscribers')
        .insert({
          email,
          first_name: first_name || null,
          source: 'lead_magnet',
          consent_given: true,
          status: 'active'
        })
        .select()
        .single();
        
      if (subError) throw subError;
      subscriberId = newSub.id;
    }

    // 2. Track the download
    const { error: dlError } = await supabase.from('lead_magnet_downloads').insert({
      lead_magnet_id,
      subscriber_id: subscriberId,
      email,
      first_name: first_name || null
    });
    
    if (dlError) throw dlError;

    // 3. Increment download count on the lead magnet
    const { data: magnet } = await supabase
      .from('lead_magnets')
      .select('download_count, file_url, success_message')
      .eq('id', lead_magnet_id)
      .single();
      
    if (magnet) {
      await supabase
        .from('lead_magnets')
        .update({ download_count: (magnet.download_count || 0) + 1 })
        .eq('id', lead_magnet_id);
    }

    return { 
      success: magnet?.success_message || 'Thanks! Your download will begin shortly.', 
      fileUrl: magnet?.file_url 
    };
  } catch (err: any) {
    console.error(err);
    return { error: err.message || 'Failed to process request.' };
  }
}
