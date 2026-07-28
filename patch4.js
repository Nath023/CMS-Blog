const fs = require('fs');
let code = fs.readFileSync('lib/database.ts', 'utf8');

// Suppress console.error for fetch failed
code = code.replace(/if \(err\?\.code \!\=\= '42P01'\) console\.error\(/g, "if (err?.code !== '42P01' && err?.message !== 'fetch failed') console.error(");

// Add isConfigured to recordPostView
code = code.replace(/export async function recordPostView\(postId: string, sessionId: string, userAgent: string\) {\n  const supabase = createServerClient\(\);/, "export async function recordPostView(postId: string, sessionId: string, userAgent: string) {\n  if (!isConfigured) return;\n  const supabase = createServerClient();");

fs.writeFileSync('lib/database.ts', code);
