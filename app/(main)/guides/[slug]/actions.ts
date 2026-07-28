'use server';

import { processLeadMagnetDownload } from '@/lib/database';

export async function downloadLeadMagnet(formData: FormData): Promise<{ error?: string; success?: string; fileUrl?: string }> {
  try {
    const honeypot = formData.get('b_name');
    if (honeypot) {
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

    const result = await processLeadMagnetDownload(email, first_name || null, lead_magnet_id);
    return result;
  } catch (err: any) {
    console.error(err);
    return { error: err.message || 'Failed to process request.' };
  }
}
