import re

with open('components/admin/AdminNav.tsx', 'r') as f:
    content = f.read()

content = re.sub(r"import \{ createClient \} from '@/lib/supabase/client';", "import { signOut } from '@/lib/database';", content)
content = re.sub(r"const supabase = createClient\(\);\n\s*await supabase\.auth\.signOut\(\);", "await signOut();", content)

with open('components/admin/AdminNav.tsx', 'w') as f:
    f.write(content)
