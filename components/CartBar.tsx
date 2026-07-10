'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';

interface CartBarProps {
  count: number;
  total: number;
}

export function CartBar({ count, total }: CartBarProps) {
  if (count === 0) return null;

  return (
    <div
      className="pointer-events-none absolute inset-x-0 z-30 flex justify-center px-4"
      style={{ bottom: 'calc(var(--bottom-nav-height) + var(--safe-bottom) + 12px)' }}
    >
      <Link
        href="/cart"
        className="pointer-events-auto flex w-full items-center justify-between rounded-sign border-2 border-coffee bg-coffee px-4 py-3 text-cream shadow-sign"
      >
        <span className="flex items-center gap-2 font-display text-base tracking-wide">
          <ShoppingBag size={18} />
          {count} item{count > 1 ? 's' : ''}
        </span>
        <span className="font-mono text-sm">View Cart · ${total.toFixed(2)}</span>
      </Link>
    </div>
  );
}
