#!/bin/bash
FILES=$(grep -rl "StaticPageContent" app/\(main\)/)
for FILE in $FILES; do
  sed -i 's/return <StaticPageContent/return <\!-- @ts-expect-error Async Server Component -->\n    <StaticPageContent/g' "$FILE"
  # Wait, JSX comment is {/* @ts-expect-error */}
  sed -i 's/return <StaticPageContent/return (\n    \/\* @ts-expect-error Async Server Component \*\/\n    <StaticPageContent/g' "$FILE"
  sed -i 's/defaultTitle=".*" \/>;/\0\n  );/g' "$FILE"
done
