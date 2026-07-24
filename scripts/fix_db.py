import re

with open('lib/database.ts', 'r') as f:
    content = f.read()

# Fix getLeadMagnetsAdmin
content = re.sub(
    r"export async function getLeadMagnetsAdmin\(\) \{\n\s*const \{ data \} = await supabase\.",
    "export async function getLeadMagnetsAdmin() {\n  const supabase = createAdminClient();\n  const { data } = await supabase.",
    content
)

# Fix getLeadMagnetsForGuides
content = re.sub(
    r"export async function getLeadMagnetsForGuides\(\) \{\n\s*const \{ data \} = await supabase\.",
    "export async function getLeadMagnetsForGuides() {\n  const supabase = createServerClient();\n  const { data } = await supabase.",
    content
)

with open('lib/database.ts', 'w') as f:
    f.write(content)
