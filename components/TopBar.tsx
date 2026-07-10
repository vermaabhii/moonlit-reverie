'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/cn';

interface TopBarProps {
  title: string;
  showBack?: boolean;
  right?: React.ReactNode;
  transparent?: boolean;
}

export function TopBar({ title, showBack, right, transparent }: TopBarProps) {
  const router = useRouter();
  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex items-center justify-between border-b-2 border-coffee px-4 py-3',
        transparent ? 'bg-transparent border-transparent' : 'bg-cream'
      )}
      style={{ paddingTop: 'calc(var(--safe-top) + 12px)' }}
    >
      <div className="flex w-9 items-center">
        {showBack && (
          <button
            onClick={() => router.back()}
            aria-label="Go back"
            className="-ml-1 flex h-9 w-9 items-center justify-center rounded-full text-coffee active:bg-coffee/10"
          >
            <ChevronLeft size={22} />
          </button>
        )}
      </div>
      <h1 className="font-display text-2xl tracking-wide text-coffee">{title}</h1>
      <div className="flex w-9 items-center justify-end">{right}</div>
    </header>
  );
}
