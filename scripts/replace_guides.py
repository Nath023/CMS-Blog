import re
import os

files = {
    'app/guides/page.tsx': {
        'import': "import { getLeadMagnetsForGuides } from '@/lib/database';",
        'body_regex': r"const supabase = createAdminClient\(\);\n\s*const \{ data: leadMagnets \} = await supabase\n\s*\.from\('lead_magnets'\)\n\s*\.select\('\*'\)\n\s*\.eq\('is_active', true\)\n\s*\.order\('created_at', \{ ascending: false \}\);",
        'body_replacement': "const leadMagnets = await getLeadMagnetsForGuides();"
    },
    'app/guides/[slug]/page.tsx': {
        'import': "import { getLeadMagnetBySlug } from '@/lib/database';",
        'body_regex': r"const supabase = createAdminClient\(\);\n\s*const \{ data: leadMagnet \} = await supabase\n\s*\.from\('lead_magnets'\)\n\s*\.select\('\*'\)\n\s*\.eq\('slug', params\.slug\)\n\s*\.eq\('is_active', true\)\n\s*\.single\(\);",
        'body_replacement': "const leadMagnet = await getLeadMagnetBySlug(params.slug);"
    },
}

for filepath, config in files.items():
    if os.path.exists(filepath):
        with open(filepath, 'r') as f:
            content = f.read()
        
        content = re.sub(r"import \{ createAdminClient \} from '@/lib/supabase/server';\n*", config['import'] + '\n', content)
        content = re.sub(config['body_regex'], config['body_replacement'], content, flags=re.DOTALL)
        
        with open(filepath, 'w') as f:
            f.write(content)
