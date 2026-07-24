import re
import os

files = {
    'app/admin/lead-magnets/[id]/page.tsx': {
        'import': "import { getLeadMagnetById } from '@/lib/database';",
        'regex': r"import \{ createClient \} from '@/lib/supabase/server';\n*",
        'body_regex': r"const supabase = await createClient\(\);\n\s*const \{ data: magnet \} = await supabase\n\s*\.from\('lead_magnets'\)\n\s*\.select\('\*'\)\n\s*\.eq\('id', params\.id\)\n\s*\.single\(\);",
        'body_replacement': "const magnet = await getLeadMagnetById(params.id);"
    },
    'app/admin/tags/[id]/page.tsx': {
        'import': "import { getTagById } from '@/lib/database';",
        'regex': r"import \{ createClient \} from '@/lib/supabase/server';\n*",
        'body_regex': r"const supabase = createClient\(\);\n\s*const \{ data \} = await supabase\.from\('tags'\)\.select\('\*'\)\.eq\('id', id\)\.single\(\);",
        'body_replacement': "const data = await getTagById(id);"
    },
    'app/admin/categories/[id]/page.tsx': {
        'import': "import { getCategoryById } from '@/lib/database';",
        'regex': r"import \{ createClient \} from '@/lib/supabase/server';\n*",
        'body_regex': r"const supabase = createClient\(\);\n\s*const \{ data \} = await supabase\.from\('categories'\)\.select\('\*'\)\.eq\('id', id\)\.single\(\);",
        'body_replacement': "const data = await getCategoryById(id);"
    },
    'app/admin/posts/[id]/edit/page.tsx': {
        'import': "import { getPostForEdit } from '@/lib/database';",
        'regex': r"import \{ createClient \} from '@/lib/supabase/server';\n*",
        'body_regex': r"const supabase = createClient\(\);\n\s*const \{ data: p \} = await supabase\.from\('posts'\)\.select\('\*'\)\.eq\('id', params\.id\)\.single\(\);\n\s*let post = p;\n\s*let tags = '';\n\s*if \(post\) \{\n\s*const \{ data: tagsData \} = await supabase\.from\('post_tags'\)\.select\('tag:tags\(name\)'\)\.eq\('post_id', post\.id\);\n\s*if \(tagsData\) \{\n\s*tags = \(tagsData as any\[\]\)\.map\(\(t: any\) => t\.tag\.name\)\.join\(', '\);\n\s*\}\n\s*\}",
        'body_replacement': "const result = await getPostForEdit(params.id);\n  let post = result?.post;\n  let tags = result?.tags || '';"
    },
    'components/blog/PopularPosts.tsx': {
        'import': "import { getPopularPosts } from '@/lib/database';",
        'regex': r"import \{ createClient \} from '@/lib/supabase/server';\n*",
        'body_regex': r"const supabase = await createClient\(\);\n\s*const \{ data: popular \} = await supabase\n\s*\.from\('posts'\)\n\s*\.select\('id, title, slug, excerpt, featured_image_url, view_count, category:categories\(name\)'\)\n\s*\.eq\('status', POST_STATUS\.PUBLISHED\)\n\s*\.order\('view_count', \{ ascending: false \}\)\n\s*\.limit\((.*?)\);",
        'body_replacement': "const popular = await getPopularPosts();"
    },
    'components/admin/MediaLibrary.tsx': {
        'import': "import { getMediaFilesClient } from '@/lib/database';",
        'regex': r"import \{ createClient \} from '@/lib/supabase/client';\n*",
        'body_regex': r"const supabase = createClient\(\);\n\s*const \{ data, error \} = await supabase\.storage\.from\('blog-images'\)\.list\(\);\n\s*if \(!error && data\) \{\n\s*const urls = data\.filter\(f => f\.name !== '\.emptyFolderPlaceholder'\)\.map\(\(f\) => \{\n\s*const \{ data: \{ publicUrl \} \} = supabase\.storage\.from\('blog-images'\)\.getPublicUrl\(f\.name\);\n\s*return \{ name: f\.name, url: publicUrl \};\n\s*\}\);\n\s*setFiles\(urls\);\n\s*\}",
        'body_replacement': "const urls = await getMediaFilesClient();\n      setFiles(urls);"
    },
}

for filepath, config in files.items():
    if os.path.exists(filepath):
        with open(filepath, 'r') as f:
            content = f.read()
        
        content = re.sub(config['regex'], config['import'] + '\n', content)
        content = re.sub(config['body_regex'], config['body_replacement'], content, flags=re.DOTALL)
        
        with open(filepath, 'w') as f:
            f.write(content)

