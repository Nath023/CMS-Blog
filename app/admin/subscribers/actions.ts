'use server';

import { deleteSubscriberAdmin, updateSubscriberStatusAdmin, exportSubscribersCsvAdmin } from '@/lib/database';
import { revalidatePath } from 'next/cache';

export async function deleteSubscriber(id: string) {
  try {
    const { error } = await deleteSubscriberAdmin(id);
    if (error) return { error: error.message };
    revalidatePath('/admin/subscribers');
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function updateSubscriberStatus(id: string, status: string) {
  try {
    const { error } = await updateSubscriberStatusAdmin(id, status);
    if (error) return { error: error.message };
    revalidatePath('/admin/subscribers');
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function exportSubscribersCsv() {
  try {
    const csvContent = await exportSubscribersCsvAdmin();
    return { csv: csvContent };
  } catch (err: any) {
    return { error: err.message };
  }
}
