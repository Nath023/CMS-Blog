'use server'

import { loginAdmin } from '@/lib/database';

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  const { error } = await loginAdmin(email, password);

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}
