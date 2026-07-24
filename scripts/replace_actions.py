import re
import os

files = {
    'app/admin/tags/actions.ts': {
        'import': "import { createTagAdmin, updateTagAdmin, deleteTagAdmin } from '@/lib/database';",
        'replacements': [
            (r"const supabase = createServerClient\(\);\n\s*const \{ error \} = await supabase\.from\('tags'\)\.insert\(payload\);", "const { error } = await createTagAdmin(payload);"),
            (r"const supabase = createServerClient\(\);\n\s*const \{ error \} = await supabase\.from\('tags'\)\.update\(payload\)\.eq\('id', id\);", "const { error } = await updateTagAdmin(id, payload);"),
            (r"const supabase = createServerClient\(\);\n\s*await supabase\.from\('tags'\)\.delete\(\)\.eq\('id', id\);", "await deleteTagAdmin(id);")
        ]
    },
    'app/admin/categories/actions.ts': {
        'import': "import { createCategoryAdmin, updateCategoryAdmin, deleteCategoryAdmin } from '@/lib/database';",
        'replacements': [
            (r"const supabase = createServerClient\(\);\n\s*const \{ error \} = await supabase\.from\('categories'\)\.insert\(payload\);", "const { error } = await createCategoryAdmin(payload);"),
            (r"const supabase = createServerClient\(\);\n\s*const \{ error \} = await supabase\.from\('categories'\)\.update\(payload\)\.eq\('id', id\);", "const { error } = await updateCategoryAdmin(id, payload);"),
            (r"const supabase = createServerClient\(\);\n\s*await supabase\.from\('categories'\)\.delete\(\)\.eq\('id', id\);", "await deleteCategoryAdmin(id);")
        ]
    },
    'app/admin/media/actions.ts': {
        'import': "import { deleteMediaFileAdmin } from '@/lib/database';",
        'replacements': [
            (r"const \{ error \} = await supabase\.storage\n\s*\.from\('blog-images'\)\n\s*\.remove\(\[fileName\]\);", "const { error } = await deleteMediaFileAdmin(fileName);")
        ]
    },
    'app/admin/subscribers/actions.ts': {
        'import': "import { deleteSubscriberAdmin, updateSubscriberStatusAdmin } from '@/lib/database';",
        'replacements': [
            (r"const \{ error \} = await supabase\.from\('subscribers'\)\.delete\(\)\.eq\('id', id\);", "const { error } = await deleteSubscriberAdmin(id);"),
            (r"const \{ error \} = await supabase\.from\('subscribers'\)\.update\(\{ status \}\)\.eq\('id', id\);", "const { error } = await updateSubscriberStatusAdmin(id, status);")
        ]
    }
}

for filepath, config in files.items():
    if os.path.exists(filepath):
        with open(filepath, 'r') as f:
            content = f.read()
        
        content = re.sub(r"import\s*\{\s*createServerClient\s*\}\s*from\s*['\"]@/lib/database['\"];?\n*", config['import'] + '\n', content)
        content = re.sub(r"import\s*\{\s*createAdminClient\s*\}\s*from\s*['\"]@/lib/database['\"];?\n*", config['import'] + '\n', content)
        
        for reg, rep in config['replacements']:
            content = re.sub(reg, rep, content, flags=re.DOTALL)
            
        with open(filepath, 'w') as f:
            f.write(content)
