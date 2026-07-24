import re

with open('app/admin/page.tsx', 'r') as f:
    content = f.read()

# Replace imports
content = re.sub(r"import { createClient } from '@/lib/supabase/server';", "import { getAdminDashboardStats } from '@/lib/database';", content)
content = re.sub(r"import { subMonths, format } from 'date-fns';\n", "", content)

# Replace the body of AdminDashboard
new_body = """
export default async function AdminDashboard() {
  const { 
    totalPosts, publishedPosts, draftPosts, archivedPosts, totalViews,
    statusData, monthlyData, recentPosts, popularPosts 
  } = await getAdminDashboardStats();

  return (
"""
content = re.sub(r"export default async function AdminDashboard\(\) \{.*?(?=  return \()", new_body, content, flags=re.DOTALL)

with open('app/admin/page.tsx', 'w') as f:
    f.write(content)
