import re
import os

files = {
    'app/admin/subscribers/page.tsx': {
        'regex': r"const \{ data: subscribers \} = await supabase\n\s*\.from\('subscribers'\)\n\s*\.select\('\*'\)\n\s*\.order\('created_at', \{ ascending: false \}\);",
        'replacement': "const subscribers = await getSubscribersAdmin();"
    },
    'app/admin/lead-magnets/page.tsx': {
        'regex': r"const \{ data: leadMagnets \} = await supabase\n\s*\.from\('lead_magnets'\)\n\s*\.select\('\*'\)\n\s*\.order\('created_at', \{ ascending: false \}\);",
        'replacement': "const leadMagnets = await getLeadMagnetsAdmin();"
    }
}

for filepath, config in files.items():
    if os.path.exists(filepath):
        with open(filepath, 'r') as f:
            content = f.read()
        
        content = re.sub(config['regex'], config['replacement'], content, flags=re.DOTALL)
        
        with open(filepath, 'w') as f:
            f.write(content)

