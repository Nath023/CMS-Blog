import re

with open('lib/database.ts', 'r') as f:
    content = f.read()

# Fix loginAdmin
content = re.sub(
    r"  const supabase = createServerClient\(\);\n  const supabase = createServerClient\(\);\n",
    "  const supabase = createServerClient();\n",
    content
)

# function missing supabase
funcs = ['saveGlobalSettings', 'downloadLeadMagnet', 'processLeadMagnetDownload']
for func in funcs:
    pattern = r"(export async function " + func + r"\([^\)]*\)[^{]*\{\n)"
    if "  const supabase = " not in content.split("export async function " + func)[1][:100]:
        content = re.sub(pattern, r"\1  const supabase = createAdminClient();\n", content)

with open('lib/database.ts', 'w') as f:
    f.write(content)

