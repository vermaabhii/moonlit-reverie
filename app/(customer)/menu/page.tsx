'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { TopBar } from '@/components/TopBar';
import { MenuItemCard } from '@/components/MenuItemCard';
import { CartBar } from '@/components/CartBar';
import { MenuCategory, MenuItem } from '@/lib/mock-data';
import { getMenuItems } from '@/lib/storage';
import { addToCart, getActiveTable, getCart, getCartCount, getCartTotal, setLineQty } from '@/lib/ordering';
import { cn } from '@/lib/cn';
import { MapPin } from 'lucide-react';

const CATEGORIES: { id: MenuCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'coffee', label: 'Coffee' },
  { id: 'food', label: 'Food' },
  { id: 'pastries', label: 'Pastries' },
];

export default function MenuPage() {
  const [active, setActive] = useState<MenuCategory | 'all'>('all');
  const [table, setTable] = useState<number | null | undefined>(undefined);
  const [qtyByItem, setQtyByItem] = useState<Record<string, number>>({});
  const [total, setTotal] = useState(0);

  const [items, setItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    async function load() {
      const fetched = await getMenuItems();
      setItems(fetched.filter(item => item.isAvailable !== false));
    }
    load();
    const t = getActiveTable();
    setTable(t);
    if (t) refreshCart(t);
  }, []);

  async function refreshCart(t: number) {
    const lines = getCart(t);
    setQtyByItem(Object.fromEntries(lines.map((l) => [l.itemId, l.qty])));
    const tot = await getCartTotal(t);
    setTotal(tot);
  }

  async function handleAdd(itemId: string) {
    if (!table) return;
    addToCart(table, itemId, 1);
    refreshCart(table);
  }

  function handleChangeQty(itemId: string, qty: number) {
    if (!table) return;
    setLineQty(table, itemId, qty);
    refreshCart(table);
  }

  const displayItems = active === 'all' ? items : items.filter((i) => i.category === active);
  const count = table ? getCartCount(table) : 0;

  return (
    <main className="screen-scroll">
      <TopBar title="Menu" />

      {table === null && (
        <Link
          href="/scan"
          className="mx-5 mt-3 flex items-center gap-2 rounded-sign border-2 border-dashed border-rust bg-rust/5 px-3 py-2.5 text-sm text-rust-dark"
        >
          <MapPin size={16} className="shrink-0" />
          Scan your table&apos;s code to order from here — browsing only for now.
        </Link>
      )}
      {typeof table === 'number' && (
        <p className="mx-5 mt-3 rounded-sign border-2 border-coffee/20 bg-cream-dark px-3 py-2 text-center font-mono text-xs text-coffee-muted">
          Ordering for Table {table}
        </p>
      )}

      <div className="sticky top-[65px] z-20 flex gap-2 overflow-x-auto border-b-2 border-coffee/10 bg-cream px-4 py-3">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActive(cat.id)}
            className={cn(
              'whitespace-nowrap rounded-sign border-2 border-coffee px-3.5 py-1.5 font-display text-sm tracking-wide',
              active === cat.id ? 'bg-coffee text-cream' : 'bg-cream text-coffee'
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-3 px-5 py-4">
        {displayItems.map((item) => (
          <MenuItemCard
            key={item.id}
            item={item}
            qty={qtyByItem[item.id] ?? 0}
            onAdd={table ? () => handleAdd(item.id) : undefined}
            onChangeQty={table ? (qty) => handleChangeQty(item.id, qty) : undefined}
          />
        ))}
      </div>

      <CartBar count={count} total={total} />
    </main>
  );
}
