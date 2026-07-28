const fs = require('fs');

// patch server.ts
let code = fs.readFileSync('lib/supabase/server.ts', 'utf8');

code = code.replace(
  /export function createClient\(\) \{/,
  `export function createClient() {
  const isConfigured = !!env.NEXT_PUBLIC_SUPABASE_URL && 
    env.NEXT_PUBLIC_SUPABASE_URL !== 'YOUR_SUPABASE_URL' && 
    !env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-ref') &&
    !env.NEXT_PUBLIC_SUPABASE_URL.includes('127.0.0.1');
    
  if (!isConfigured) {
    throw new Error('Supabase is not configured. Please connect to Supabase to enable this feature.');
  }`
);

code = code.replace(
  /export function createAdminClient\(\) \{/,
  `export function createAdminClient() {
  const isConfigured = !!env.NEXT_PUBLIC_SUPABASE_URL && 
    env.NEXT_PUBLIC_SUPABASE_URL !== 'YOUR_SUPABASE_URL' && 
    !env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-ref') &&
    !env.NEXT_PUBLIC_SUPABASE_URL.includes('127.0.0.1');
    
  if (!isConfigured) {
    throw new Error('Supabase is not configured. Please connect to Supabase to enable this feature.');
  }`
);

fs.writeFileSync('lib/supabase/server.ts', code);

// patch client.ts
let clientCode = fs.readFileSync('lib/supabase/client.ts', 'utf8');

clientCode = clientCode.replace(
  /export function createClient\(\) \{/,
  `export function createClient() {
  const isConfigured = !!env.NEXT_PUBLIC_SUPABASE_URL && 
    env.NEXT_PUBLIC_SUPABASE_URL !== 'YOUR_SUPABASE_URL' && 
    !env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-ref') &&
    !env.NEXT_PUBLIC_SUPABASE_URL.includes('127.0.0.1');
    
  if (!isConfigured) {
    throw new Error('Supabase is not configured. Please connect to Supabase to enable this feature.');
  }`
);

fs.writeFileSync('lib/supabase/client.ts', clientCode);
