'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { TopBar } from '@/components/TopBar';
import { Button } from '@/components/Button';
import { getSession } from '@/lib/auth';
import {
  CartLineDetailed,
  getActiveTable,
  getCartDetailed,
  placeOrder,
  setLineQty,
} from '@/lib/ordering';
import { addStampForOrder } from '@/lib/rewards';
import type { Order } from '@/lib/ordering';
import { Minus, Plus, Trash2, CheckCircle2 } from 'lucide-react';

export default function CartPage() {
  const [table, setTable] = useState<number | null | undefined>(undefined);
  const [lines, setLines] = useState<CartLineDetailed[]>([]);
  const [notes, setNotes] = useState('');
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [rewardEarned, setRewardEarned] = useState(false);

  useEffect(() => {
    const t = getActiveTable();
    setTable(t);
    if (t) setLines(getCartDetailed(t));
  }, []);

  function updateQty(itemId: string, qty: number) {
    if (!table) return;
    setLineQty(table, itemId, qty);
    setLines(getCartDetailed(table));
  }

  function handlePlaceOrder() {
    if (!table) return;
    const session = getSession();
    const userId = session?.id ?? `guest-table-${table}`;
    const order = placeOrder(table, userId, notes.trim() || undefined);
    if (!order) return;
    if (session) {
      const { rewardEarned } = addStampForOrder(session.id);
      setRewardEarned(rewardEarned);
    }
    setPlacedOrder(order);
  }

  const total = lines.reduce((sum, l) => sum + l.lineTotal, 0);

  if (placedOrder) {
    return (
      <main className="screen-scroll flex flex-col items-center px-6 py-16 text-center">
        <CheckCircle2 size={52} className="text-rust" />
        <h1 className="mt-4 font-display text-3xl tracking-wide text-coffee">Order sent!</h1>
        <p className="mt-2 text-sm text-coffee-muted">
          Table {placedOrder.table} — we&apos;ll bring it right out.
        </p>
        <div className="mt-6 vintage-border rounded-card bg-cream-dark px-6 py-4">
          <p className="font-mono text-xs uppercase tracking-wide text-coffee-muted">Order Number</p>
          <p className="mt-1 font-mono text-2xl text-rust">{placedOrder.orderNumber}</p>
        </div>
        {rewardEarned && (
          <p className="mt-4 rounded-sign bg-mustard/20 px-4 py-2 text-sm text-coffee">
            🎉 That completed your punch card — a free item is on your account.
          </p>
        )}
        {!getSession() && (
          <p className="mt-4 max-w-xs text-xs text-coffee-muted">
            Sign in next time to start earning stamps toward a free item.
          </p>
        )}
        <Link href="/menu" className="mt-8 w-full">
          <Button className="w-full">Back to Menu</Button>
        </Link>
      </main>
    );
  }

  if (table === undefined) return null;

  if (!table) {
    return (
      <main className="screen-scroll flex flex-col items-center px-6 py-16 text-center">
        <TopBar title="Your Order" />
        <p className="mt-10 text-sm text-coffee-muted">Scan your table&apos;s code first to start an order.</p>
        <Link href="/scan" className="mt-6 w-full">
          <Button className="w-full">Scan Table Code</Button>
        </Link>
      </main>
    );
  }

  return (
    <main className="screen-scroll">
      <TopBar title="Your Order" showBack />
      <p className="px-5 pt-3 text-center font-mono text-xs text-coffee-muted">Table {table}</p>

      {lines.length === 0 ? (
        <div className="flex flex-col items-center px-6 py-16 text-center">
          <p className="text-sm text-coffee-muted">Your cart is empty.</p>
          <Link href="/menu" className="mt-6 w-full">
            <Button className="w-full">Browse Menu</Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4 px-5 py-5">
          <div className="flex flex-col gap-3">
            {lines.map((line) => (
              <div
                key={line.itemId}
                className="vintage-border flex items-center justify-between gap-3 rounded-card bg-cream-dark p-3"
              >
                <div className="min-w-0">
                  <p className="font-display text-base tracking-wide text-coffee">{line.item.name}</p>
                  <p className="font-mono text-xs text-coffee-muted">
                    ${line.item.price.toFixed(2)} × {line.qty}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1.5 rounded-sign border-2 border-coffee bg-cream px-1">
                  <button
                    onClick={() => updateQty(line.itemId, line.qty - 1)}
                    aria-label={`Remove one ${line.item.name}`}
                    className="flex h-8 w-8 items-center justify-center text-coffee"
                  >
                    {line.qty === 1 ? <Trash2 size={14} /> : <Minus size={14} />}
                  </button>
                  <span className="w-4 text-center font-mono text-sm">{line.qty}</span>
                  <button
                    onClick={() => updateQty(line.itemId, line.qty + 1)}
                    aria-label={`Add one more ${line.item.name}`}
                    className="flex h-8 w-8 items-center justify-center text-coffee"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <label className="block">
            <span className="mb-1.5 block font-display text-sm tracking-wide text-coffee">
              Notes for the kitchen (optional)
            </span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Allergies, no onions, extra hot…"
              rows={2}
              className="vintage-border w-full rounded-sign bg-cream px-3 py-2.5 text-sm"
            />
          </label>

          <div className="flex items-center justify-between border-t-2 border-coffee/10 pt-3">
            <span className="font-display text-lg tracking-wide text-coffee">Total</span>
            <span className="font-mono text-xl text-rust">${total.toFixed(2)}</span>
          </div>

          <Button size="lg" onClick={handlePlaceOrder} className="w-full">
            Send Order to Table {table}
          </Button>
        </div>
      )}
    </main>
  );
}
