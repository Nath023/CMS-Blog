import re
import os

files = [
    'app/guides/[slug]/actions.ts',
    'app/admin/subscribers/actions.ts',
    'app/admin/lead-magnets/actions.ts',
    'app/admin/tags/actions.ts',
    'app/admin/login/actions.ts',
    'app/admin/categories/actions.ts',
    'app/admin/media/actions.ts',
    'app/api/cron/publish/route.ts',
    'lib/blog/actions.ts',
    'lib/newsletter/leadMagnetActions.ts',
    'lib/newsletter/actions.ts',
]

for filepath in files:
    if os.path.exists(filepath):
        with open(filepath, 'r') as f:
            content = f.read()
        
        # We need to replace import { createAdminClient } from '@/lib/supabase/server'
        content = re.sub(r"import\s*\{\s*createAdminClient\s*\}\s*from\s*['\"]@/lib/supabase/server['\"];?", "import { createAdminClient } from '@/lib/database';", content)
        content = re.sub(r"import\s*\{\s*createClient\s*\}\s*from\s*['\"]@/lib/supabase/server['\"];?", "import { createServerClient } from '@/lib/database';", content)
        content = re.sub(r"import\s*\{\s*createClient\s*\}\s*from\s*['\"]@/lib/supabase/client['\"];?", "import { createBrowserClient } from '@/lib/database';", content)
        
        # For the ones that imported createClient as something else, we need to replace the call.
        content = content.replace("createClient()", "createServerClient()")
        
        with open(filepath, 'w') as f:
            f.write(content)

