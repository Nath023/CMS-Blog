const fs = require('fs');

function replaceInFile(filePath, replacements) {
  let code = fs.readFileSync(filePath, 'utf8');
  for (let r of replacements) {
    code = code.replace(r.from, r.to);
  }
  fs.writeFileSync(filePath, code);
}

// 1. app/admin/page.tsx
replaceInFile('app/admin/page.tsx', [
  { from: `import { createClient } from '@/lib/supabase/server';`, to: `import { getAdminDashboardStats } from '@/lib/database';` },
  { from: `const supabase = createClient();\n  let totalPosts = 0, publishedPosts = 0, draftPosts = 0, archivedPosts = 0;\n  let recentPosts: any[] = [];\n  let popularPosts: any[] = [];\n\n  const statusData = [\n    { name: 'Published', value: 0, color: '#10b981' },\n    { name: 'Drafts', value: 0, color: '#f59e0b' },\n    { name: 'Archived', value: 0, color: '#64748b' },\n  ];\n\n  try {\n    const { count: tP } = await supabase.from('posts').select('*', { count: 'exact', head: true });\n    totalPosts = tP || 0;\n\n    const { count: pP } = await supabase.from('posts').select('*', { count: 'exact', head: true }).eq('status', POST_STATUS.PUBLISHED);\n    publishedPosts = pP || 0;\n\n    const { count: dP } = await supabase.from('posts').select('*', { count: 'exact', head: true }).eq('status', POST_STATUS.DRAFT);\n    draftPosts = dP || 0;\n\n    const { count: aP } = await supabase.from('posts').select('*', { count: 'exact', head: true }).eq('status', POST_STATUS.ARCHIVED);\n    archivedPosts = aP || 0;\n\n    statusData[0].value = publishedPosts;\n    statusData[1].value = draftPosts;\n    statusData[2].value = archivedPosts;\n\n    // Get recent posts\n    const { data: rP } = await supabase\n      .from('posts')\n      .select('id, title, status, created_at')\n      .order('created_at', { ascending: false })\n      .limit(LIMITS.DASHBOARD_RECENT_POSTS);\n    recentPosts = rP || [];\n\n    // Get popular posts\n    const { data: popP } = await supabase\n      .from('posts')\n      .select('id, title, status, view_count')\n      .order('view_count', { ascending: false })\n      .limit(LIMITS.DASHBOARD_RECENT_POSTS);\n    popularPosts = popP || [];\n\n    // Calculate monthly data for the last 6 months\n    // For a real app, you would query analytics or views data grouped by month.\n    // Here we'll generate some placeholder data based on actual post views if possible, or mock it.\n    const months = Array.from({ length: 6 }).map((_, i) => {\n      const d = subMonths(new Date(), 5 - i);\n      return {\n        name: format(d, 'MMM'),\n        views: Math.floor(Math.random() * 500) + 100, // mock views\n        visitors: Math.floor(Math.random() * 300) + 50, // mock visitors\n      };\n    });\n    \n    var monthlyData = months;\n\n  } catch (err) {\n    console.error('Error fetching dashboard stats:', err);\n    var monthlyData: any[] = [];\n  }`, 
    to: `const { totalPosts, publishedPosts, draftPosts, archivedPosts, statusData, monthlyData, recentPosts, popularPosts } = await getAdminDashboardStats();` }
]);

