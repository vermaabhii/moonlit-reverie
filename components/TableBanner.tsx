'use client';

import { MapPin, X } from 'lucide-react';
import { useTableSession } from '@/lib/table-session';

export function TableBanner() {
  const { table, bannerDismissed, dismissBanner } = useTableSession();

  if (!table || bannerDismissed) return null;

  return (
    <div
      className="flex shrink-0 items-center justify-between gap-2 border-b-2 border-coffee bg-mustard px-4 py-2"
      style={{ paddingTop: 'calc(var(--safe-top) + 8px)' }}
    >
      <span className="flex items-center gap-1.5 font-mono text-xs text-coffee">
        <MapPin size={14} className="shrink-0" />
        You&apos;re seated at Table {table}
      </span>
      <button
        onClick={dismissBanner}
        aria-label="Dismiss"
        className="-mr-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-coffee active:bg-coffee/10"
      >
        <X size={14} />
      </button>
    </div>
  );
}
