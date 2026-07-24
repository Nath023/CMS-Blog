import re

with open('lib/database.ts', 'r') as f:
    content = f.read()

# Add imports if missing
if "SUBSCRIBER_STATUS" not in content[:500]:
    content = content.replace("import { POST_STATUS, LIMITS, BUCKETS } from '@/constants';", "import { POST_STATUS, LIMITS, BUCKETS, SUBSCRIBER_STATUS } from '@/constants';")

if "sendBlogPostEmail" not in content[:500]:
    content = content.replace('export async function signOut() {', 'import { sendBlogPostEmail, sendLeadMagnetEmail, sendWelcomeEmail } from "@/lib/email";\nexport async function signOut() {')

# Fix function missing supabase
functions_to_fix = [
    'getLeadMagnetBySlug', 'getTagsAdmin', 'getCategoriesAdmin', 'getMediaFilesAdmin', 
    'getAdminPosts', 'getScheduledPosts', 'getSubscribersAdmin', 'uploadMediaFile'
]

for func in functions_to_fix:
    pattern = r"(export async function " + func + r"\([^\)]*\)\s*(?::\s*[^{]+)?\{\n)"
    replacement = r"\1  const supabase = createAdminClient();\n"
    content = re.sub(pattern, replacement, content)

with open('lib/database.ts', 'w') as f:
    f.write(content)
