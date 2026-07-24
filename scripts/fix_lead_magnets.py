import re
import os

with open('app/admin/lead-magnets/actions.ts', 'r') as f:
    content = f.read()

content = re.sub(r"import\s*\{\s*createAdminClient\s*\}\s*from\s*['\"]@/lib/database['\"];?\n*", "import { createLeadMagnetAdmin, uploadLeadMagnetFile } from '@/lib/database';\n", content)

# It's a bit complicated. I'll just rewrite the file content manually for simplicity in python.
