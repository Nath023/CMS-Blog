import re

with open('lib/database.ts', 'r') as f:
    content = f.read()

# Fix sendBlogPostEmail mock
content = content.replace(
    'async function sendBlogPostEmail(email: string, subject: string, link: string, ...args: any[]) {}',
    'async function sendBlogPostEmail(email: any, subject: string, link: string, ...args: any[]) {}'
)

# Fix processLeadMagnetDownload
match = re.search(r"export async function processLeadMagnetDownload.*?\n", content)
if match:
    replacement = match.group(0) + "  const supabase = createAdminClient();\n"
    content = content.replace(match.group(0), replacement)
else:
    print("processLeadMagnetDownload not found")

with open('lib/database.ts', 'w') as f:
    f.write(content)

