import re
import os

files = {
    'app/admin/subscribers/page.tsx': {
        'import': "import { getSubscribersAdmin } from '@/lib/database';",
        'body_regex': r"const supabase = createAdminClient\(\);\n\s*const \{ data \} = await supabase\n\s*\.from\('subscribers'\)\n\s*\.select\('\*'\)\n\s*\.order\('created_at', \{ ascending: false \}\);",
        'body_replacement': "const data = await getSubscribersAdmin();"
    },
    'app/admin/lead-magnets/page.tsx': {
        'import': "import { getLeadMagnetsAdmin } from '@/lib/database';",
        'body_regex': r"const supabase = createAdminClient\(\);\n\s*const \{ data \} = await supabase\n\s*\.from\('lead_magnets'\)\n\s*\.select\('\*'\)\n\s*\.order\('created_at', \{ ascending: false \}\);",
        'body_replacement': "const data = await getLeadMagnetsAdmin();"
    },
    'app/admin/tags/page.tsx': {
        'import': "import { getTagsAdmin } from '@/lib/database';",
        'body_regex': r"const supabase = createAdminClient\(\);\n\s*const \{ data \} = await supabase\.from\('tags'\)\.select\('\*'\)\.order\('name'\);",
        'body_replacement': "const data = await getTagsAdmin();"
    },
    'app/admin/categories/page.tsx': {
        'import': "import { getCategoriesAdmin } from '@/lib/database';",
        'body_regex': r"const supabase = createAdminClient\(\);\n\s*const \{ data \} = await supabase\.from\('categories'\)\.select\('\*'\)\.order\('name'\);",
        'body_replacement': "const data = await getCategoriesAdmin();"
    },
    'app/admin/media/page.tsx': {
        'import': "import { getMediaFilesAdmin } from '@/lib/database';",
        'body_regex': r"const supabase = createAdminClient\(\);\n\s*const \{ data, error \} = await supabase\.storage\.from\('blog-images'\)\.list\(\);\n\s*let files: any\[\] = \[\];\n\s*if \(!error && data\) \{\n\s*files = data\.filter\(f => f\.name !== '\.emptyFolderPlaceholder'\)\.map\(\(f\) => \{\n\s*const \{ data: \{ publicUrl \} \} = supabase\.storage\.from\('blog-images'\)\.getPublicUrl\(f\.name\);\n\s*return \{ name: f\.name, url: publicUrl, created_at: f\.created_at \};\n\s*\}\);\n\s*\}",
        'body_replacement': "const files = await getMediaFilesAdmin();"
    },
    'app/admin/posts/scheduled/page.tsx': {
        'import': "import { getScheduledPosts } from '@/lib/database';",
        'body_regex': r"const supabase = createAdminClient\(\);\n\s*const now = new Date\(\)\.toISOString\(\);\n\s*const \{ data: posts \} = await supabase\n\s*\.from\('posts'\)\n\s*\.select\(`\n\s*id, title, slug, status, created_at, published_at,\n\s*category:categories\(name\)\n\s*`\)\n\s*\.eq\('status', POST_STATUS\.DRAFT\)\n\s*\.gt\('published_at', now\)\n\s*\.order\('published_at', \{ ascending: true \}\);",
        'body_replacement': "const posts = await getScheduledPosts();"
    },
    'app/admin/posts/page.tsx': {
        'import': "import { getAdminPosts } from '@/lib/database';",
        'body_regex': r"const supabase = createAdminClient\(\);\n\s*let query = supabase\n\s*\.from\('posts'\)\n\s*\.select\(`\n\s*id, title, slug, status, created_at, published_at,\n\s*category:categories\(name\),\n\s*author_name\n\s*`\)\n\s*\.order\('created_at', \{ ascending: false \}\);\n\s*if \(status && \[POST_STATUS\.PUBLISHED, POST_STATUS\.DRAFT, POST_STATUS\.ARCHIVED\]\.includes\(status as any\)\) \{\n\s*query = query\.eq\('status', status\);\n\s*\}\n\s*const \{ data: posts \} = await query;",
        'body_replacement': "const posts = await getAdminPosts(status);"
    }
}

for filepath, config in files.items():
    if os.path.exists(filepath):
        with open(filepath, 'r') as f:
            content = f.read()
        
        content = re.sub(r"import \{ createAdminClient \} from '@/lib/supabase/server';\n*", config['import'] + '\n', content)
        content = re.sub(config['body_regex'], config['body_replacement'], content, flags=re.DOTALL)
        
        with open(filepath, 'w') as f:
            f.write(content)

