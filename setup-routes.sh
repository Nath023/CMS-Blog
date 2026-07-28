#!/bin/bash
mkdir -p app/\(main\)
mv app/page.tsx app/\(main\)/ 2>/dev/null
mv app/blog app/\(main\)/ 2>/dev/null
mv app/guides app/\(main\)/ 2>/dev/null
mv app/about app/\(main\)/ 2>/dev/null
mv app/contact app/\(main\)/ 2>/dev/null
mv app/privacy app/\(main\)/ 2>/dev/null
mv app/terms app/\(main\)/ 2>/dev/null

cat << 'INNER_EOF' > app/\(main\)/layout.tsx
import { Header } from '@/components/layout/Header';
import { getSettings } from '@/lib/fetch';

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();

  return (
    <>
      <Header settings={settings} />
      {children}
    </>
  );
}
INNER_EOF

sed -i '/<Header/d' app/\(main\)/blog/layout.tsx 2>/dev/null || true
sed -i '/<Header/d' app/\(main\)/guides/layout.tsx 2>/dev/null || true
sed -i '/<Header/d' app/\(main\)/about/layout.tsx 2>/dev/null || true
sed -i '/<Header/d' app/\(main\)/contact/layout.tsx 2>/dev/null || true
