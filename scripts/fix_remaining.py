import re
import os

files = {
    'app/admin/tags/[id]/page.tsx': {
        'regex': r"const supabase = createClient\(\);\n\s*let tag = null;\n\s*try \{\n\s*const \{ data \} = await supabase\.from\('tags'\)\.select\('\*'\)\.eq\('id', id\)\.single\(\);\n\s*tag = data;\n\s*\} catch \(e\) \{\n\s*console\.error\('Error fetching tag:', e\);\n\s*\}",
        'replacement': "const tag = await getTagById(id);"
    },
    'app/admin/categories/[id]/page.tsx': {
        'regex': r"const supabase = createClient\(\);\n\s*let category = null;\n\s*try \{\n\s*const \{ data \} = await supabase\.from\('categories'\)\.select\('\*'\)\.eq\('id', id\)\.single\(\);\n\s*category = data;\n\s*\} catch \(e\) \{\n\s*console\.error\('Error fetching category:', e\);\n\s*\}",
        'replacement': "const category = await getCategoryById(id);"
    },
    'components/admin/MediaLibrary.tsx': {
        'regex': r"const supabase = createClient\(\);\n\s*try \{\n\s*const \{ data, error \} = await supabase\.storage\.from\('blog-images'\)\.list\(\);\n\s*if \(!error && data\) \{\n\s*const urls = data\.filter\(f => f\.name !== '\.emptyFolderPlaceholder'\)\.map\(\(f\) => \{\n\s*const \{ data: \{ publicUrl \} \} = supabase\.storage\.from\('blog-images'\)\.getPublicUrl\(f\.name\);\n\s*return \{ name: f\.name, url: publicUrl \};\n\s*\}\);\n\s*setFiles\(urls\);\n\s*\}\n\s*\} catch \(e\) \{\n\s*console\.error\('Error fetching media:', e\);\n\s*\}",
        'replacement': "const urls = await getMediaFilesClient();\n      setFiles(urls);"
    }
}

for filepath, config in files.items():
    if os.path.exists(filepath):
        with open(filepath, 'r') as f:
            content = f.read()
        
        content = re.sub(config['regex'], config['replacement'], content, flags=re.DOTALL)
        
        with open(filepath, 'w') as f:
            f.write(content)

