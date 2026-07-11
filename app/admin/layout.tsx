'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { cn } from '@/lib/cn';
import { LayoutDashboard, Menu as MenuIcon, CalendarRange, QrCode, LogOut } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const session = await getSession();
      if (!session || !session.isAdmin) {
        router.replace('/login');
      } else {
        setAuthorized(true);
      }
    }
    checkAuth();
  }, [router]);

  if (!authorized) return null;

  const tabs = [
    { label: 'Orders', href: '/admin/orders', icon: LayoutDashboard },
    { label: 'Menu', href: '/admin/menu', icon: MenuIcon },
    { label: 'Reservations', href: '/admin/reservations', icon: CalendarRange },
    { label: 'Tables', href: '/admin/tables', icon: QrCode },
  ];

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-neutral-100 text-neutral-900 font-sans">
      <aside className="flex md:w-64 flex-shrink-0 flex-col bg-neutral-900 text-neutral-200">
        <div className="flex h-16 items-center px-6 border-b border-neutral-800 shrink-0">
          <h1 className="text-lg font-bold tracking-tight text-white">Moonlit Staff</h1>
        </div>
        
        <nav className="flex-1 flex flex-row md:flex-col overflow-x-auto md:overflow-visible space-x-1 md:space-x-0 md:space-y-1 p-2 md:p-4">
          {tabs.map((tab) => {
            const isActive = pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive ? 'bg-neutral-800 text-white' : 'hover:bg-neutral-800/50 hover:text-white'
                )}
              >
                <tab.icon size={18} />
                {tab.label}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-2 md:p-4 border-t border-neutral-800 shrink-0 hidden md:block">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors"
          >
            <LogOut size={18} />
            Back to Cafe
          </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
