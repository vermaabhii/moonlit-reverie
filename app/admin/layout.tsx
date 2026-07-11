'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { TopBar } from '@/components/TopBar';
import { cn } from '@/lib/cn';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const session = getSession();
    if (!session || !session.isAdmin) {
      router.replace('/login');
    } else {
      setAuthorized(true);
    }
  }, [router]);

  if (!authorized) return null;

  const tabs = [
    { label: 'Menu', href: '/admin/menu' },
    { label: 'Reservations', href: '/admin/reservations' },
    { label: 'Tables', href: '/admin/tables' },
  ];

  return (
    <div className="flex h-full flex-col bg-cream">
      <TopBar title="Admin Panel" showBack />
      
      <div className="flex gap-2 overflow-x-auto border-b-2 border-coffee/10 bg-cream px-4 py-3">
        {tabs.map((tab) => {
          const isActive = pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'whitespace-nowrap rounded-sign border-2 border-coffee px-3.5 py-1.5 font-display text-sm tracking-wide',
                isActive ? 'bg-coffee text-cream' : 'bg-cream text-coffee'
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
