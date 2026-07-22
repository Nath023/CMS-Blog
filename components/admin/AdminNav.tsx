'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, FileText, Folder, Tag, Image as ImageIcon, Users, BookOpen, Settings, LogOut } from 'lucide-react';

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === '/admin/login') return null;

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Posts', href: '/admin/posts', icon: FileText },
    { name: 'Categories', href: '/admin/categories', icon: Folder },
    { name: 'Tags', href: '/admin/tags', icon: Tag },
    { name: 'Media', href: '/admin/media', icon: ImageIcon },
    { name: 'Subscribers', href: '/admin/subscribers', icon: Users },
    { name: 'Lead Magnets', href: '/admin/lead-magnets', icon: BookOpen },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <nav className="flex md:flex-col gap-2 sm:gap-1 text-sm font-medium overflow-x-auto whitespace-nowrap hide-scrollbar pb-2 md:pb-0">
      {navItems.map((item) => {
        const isActive = item.href === '/admin' ? pathname === '/admin' : pathname?.startsWith(item.href);
        const Icon = item.icon;
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 md:py-2.5 rounded-xl transition-all duration-200",
              isActive
                ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary font-bold"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
            )}
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span className="hidden md:inline-block">{item.name}</span>
            <span className="md:hidden">{item.name}</span>
          </Link>
        );
      })}
      
      <button 
        onClick={handleLogout} 
        className="flex items-center gap-3 px-3 py-2 md:py-2.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-all font-medium md:mt-4"
      >
        <LogOut className="w-4 h-4 shrink-0" />
        <span className="hidden md:inline-block">Log out</span>
        <span className="md:hidden">Log out</span>
      </button>
    </nav>
  );
}
