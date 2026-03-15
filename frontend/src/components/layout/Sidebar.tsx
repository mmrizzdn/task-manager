'use client';

import Link from 'next/link';
import { LayoutDashboard, CheckSquare, Users } from 'lucide-react';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const pathname = usePathname() || '';

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Tasks', href: '/dashboard/tasks', icon: CheckSquare },
    { label: 'Users', href: '/dashboard/users', icon: Users },
  ];

  return (
    <aside
      style={{ width: '280px', borderRight: '1px solid #e2e8f0' }}
      className="w-72 flex flex-col bg-white border-r border-slate-200 sticky top-0 h-screen self-start overflow-y-auto z-50"
    >
      <div className="border-slate-200" style={{ padding: '16px 24px' }}>
        <Link href="/dashboard" className="text-2xl font-bold text-slate-900">
          Task Manager
        </Link>
      </div>
      <nav className="mt-4 px-2 flex-1 overflow-y-auto pb-8">
        {navItems.map((item) => {
          const active =
            item.href === '/dashboard'
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium mx-2 my-1 transition-colors ${
                active ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
