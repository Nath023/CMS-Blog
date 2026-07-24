import re
import os

files = [
    'lib/blog/queries.ts',
    'lib/blog/actions.ts',
    'lib/newsletter/actions.ts',
    'lib/newsletter/leadMagnetActions.ts'
]

combined_code = []

for filepath in files:
    if os.path.exists(filepath):
        with open(filepath, 'r') as f:
            content = f.read()
            # Remove imports
            content = re.sub(r"^import\s+.*?;?\n", "", content, flags=re.MULTILINE)
            # Remove 'use server'
            content = re.sub(r"^'use server';?\n", "", content, flags=re.MULTILINE)
            combined_code.append(f"// --- From {filepath} ---\n{content}\n")

with open('lib/database.ts', 'a') as f:
    f.write("\n" + "\n".join(combined_code))
