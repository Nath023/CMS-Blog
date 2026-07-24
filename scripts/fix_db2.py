import re

with open('lib/database.ts', 'r') as f:
    content = f.read()

def inject_client(func_name, client_type):
    global content
    pattern = r"(export async function " + func_name + r"\([^\)]*\)\s*(?::\s*[^{]+)?\{\n)"
    replacement = r"\1  const supabase = " + client_type + "();\n"
    content = re.sub(pattern, replacement, content)

inject_client('subscribeToNewsletter', 'createAdminClient')
inject_client('downloadLeadMagnet', 'createAdminClient')
inject_client('recordPostView', 'createAdminClient')

with open('lib/database.ts', 'w') as f:
    f.write(content)

