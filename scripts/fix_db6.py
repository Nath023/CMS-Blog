import re

with open('lib/database.ts', 'r') as f:
    content = f.read()

# Fix loginAdmin
content = re.sub(
    r"(export async function loginAdmin\([^\)]*\)\s*\{\n)",
    r"\1  const supabase = createServerClient();\n",
    content
)

# Fix processLeadMagnetDownload
content = re.sub(
    r"(export async function processLeadMagnetDownload\([^\)]*\)[^{]*\{\n)",
    r"\1  const supabase = createAdminClient();\n",
    content
)

# Fix sendBlogPostEmail mock
content = content.replace(
    'async function sendBlogPostEmail(email: string, subject: string, link: string) {}',
    'async function sendBlogPostEmail(email: string, subject: string, link: string, ...args: any[]) {}'
)

with open('lib/database.ts', 'w') as f:
    f.write(content)

