'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, UtensilsCrossed, QrCode, CalendarClock, UserRound } from 'lucide-react';
import { cn } from '@/lib/cn';

interface Tab {
  href: string;
  label: string;
  icon: typeof Home;
  isCenter?: boolean;
}

const TABS: Tab[] = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/menu', label: 'Menu', icon: UtensilsCrossed },
  { href: '/scan', label: 'Scan', icon: QrCode, isCenter: true },
  { href: '/reserve', label: 'Reserve', icon: CalendarClock },
  { href: '/login', label: 'Account', icon: UserRound },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="absolute inset-x-0 bottom-0 z-40 border-t-2 border-coffee bg-cream/95 backdrop-blur"
      style={{ paddingBottom: 'var(--safe-bottom)' }}
      aria-label="Primary"
    >
      <ul className="flex h-[var(--bottom-nav-height)] items-stretch justify-between px-2">
        {TABS.map(({ href, label, icon: Icon, isCenter }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
          if (isCenter) {
            return (
              <li key={href} className="flex flex-1 items-center justify-center">
                <Link
                  href={href}
                  aria-label={label}
                  className={cn(
                    'flex h-14 w-14 -translate-y-4 items-center justify-center rounded-full border-2 border-coffee bg-rust text-cream shadow-sign transition-transform active:translate-y-[-12px] active:scale-95',
                    active && 'bg-rust-dark'
                  )}
                >
                  <Icon size={26} strokeWidth={2.25} />
                </Link>
              </li>
            );
          }
          return (
            <li key={href} className="flex flex-1">
              <Link
                href={href}
                aria-label={label}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex flex-1 flex-col items-center justify-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-coffee-muted transition-colors',
                  active && 'text-rust'
                )}
              >
                <Icon size={20} strokeWidth={active ? 2.5 : 2} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
