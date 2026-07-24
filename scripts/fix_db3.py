import re

with open('lib/database.ts', 'r') as f:
    content = f.read()

# Add supabase back where it was deleted
functions_to_fix = [
    'createTagAdmin', 'updateTagAdmin', 'deleteTagAdmin',
    'createCategoryAdmin', 'updateCategoryAdmin', 'deleteCategoryAdmin',
    'deleteMediaFileAdmin', 'deleteSubscriberAdmin', 'updateSubscriberStatusAdmin',
    'createLeadMagnetDownload', 'createLeadMagnetAdmin', 'uploadLeadMagnetFile',
    'updateLeadMagnetAdmin', 'deleteLeadMagnetAdmin', 'processLeadMagnetDownload',
    'publishScheduledPostsAdmin', 'exportSubscribersCsvAdmin', 'subscribeToNewsletter',
    'downloadLeadMagnet', 'getLeadMagnetsAdmin'
]

for func in functions_to_fix:
    pattern = r"(export async function " + func + r"\([^\)]*\)\s*(?::\s*[^{]+)?\{\n)"
    replacement = r"\1  const supabase = createAdminClient();\n"
    content = re.sub(pattern, replacement, content)

with open('lib/database.ts', 'w') as f:
    f.write(content)
