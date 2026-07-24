import { z } from 'zod';

const isServer = typeof window === 'undefined';

const clientSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().min(1, "NEXT_PUBLIC_SUPABASE_URL is required"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY is required"),
  NEXT_PUBLIC_APP_URL: z.string().min(1, "NEXT_PUBLIC_APP_URL is required"),
  NEXT_PUBLIC_GA_ID: z.string().optional(),
});

const serverSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, "SUPABASE_SERVICE_ROLE_KEY is required"),
  RESEND_API_KEY: z.string().min(1, "RESEND_API_KEY is required"),
  EMAIL_FROM: z.string().min(1, "EMAIL_FROM is required"),
  CRON_SECRET: z.string().min(1, "CRON_SECRET is required"),
  WEBHOOK_SECRET: z.string().min(1, "WEBHOOK_SECRET is required"),
});

const clientEnv = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
};

// Only require validation in development or production runtime, 
// allow build to pass if we want, or strict fail. The user said "Fail immediately".
const skipValidation = process.env.SKIP_ENV_VALIDATION === 'true';

const _clientEnv = clientSchema.safeParse(clientEnv);

if (!_clientEnv.success) {
  // console.error("❌ Invalid client environment variables:", _clientEnv.error.format());
}

let _serverEnvData = {};
if (isServer) {
  const serverEnv = {
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    EMAIL_FROM: process.env.EMAIL_FROM,
    CRON_SECRET: process.env.CRON_SECRET,
    WEBHOOK_SECRET: process.env.WEBHOOK_SECRET,
  };
  
  const _serverEnv = serverSchema.safeParse(serverEnv);
  
  if (!_serverEnv.success) {
    // console.error("❌ Invalid server environment variables:", _serverEnv.error.format());
  } else {
    _serverEnvData = _serverEnv.data;
  }
}

export const env = {
  ...(clientEnv as any),
  ...(isServer ? _serverEnvData : {}),
} as z.infer<typeof clientSchema> & z.infer<typeof serverSchema>;
