#!/bin/bash

# List of all files containing "coming soon" - wait, we already updated them so they have StaticPageContent.
# So let's find all files containing StaticPageContent instead.
FILES=$(grep -rl "StaticPageContent" app/\(main\)/)

for FILE in $FILES; do
  # Extract TITLE and PAGE_KEY from the existing file
  TITLE=$(grep -oP 'defaultTitle="\K[^"]*' "$FILE" | head -n 1)
  PAGE_KEY=$(grep -oP 'pageKey="\K[^"]*' "$FILE" | head -n 1)

  if [ -z "$TITLE" ]; then
    continue
  fi

  cat << INNER_EOF > "$FILE"
import { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { StaticPageContent } from '@/components/StaticPageContent';
import { getSettings } from '@/lib/fetch';

export const metadata: Metadata = {
  title: \`${TITLE} | \${siteConfig.name}\`,
  description: \`${TITLE} for \${siteConfig.name}.\`,
};

export default async function Page() {
  const settings = await getSettings();
  const content = settings[\`page_${PAGE_KEY}\`];
  
  return <StaticPageContent content={content} defaultTitle="${TITLE}" />;
}
INNER_EOF

  echo "Updated $FILE"
done
