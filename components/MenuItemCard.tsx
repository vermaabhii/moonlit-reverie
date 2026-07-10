import type { MenuItem } from '@/lib/mock-data';
import { cn } from '@/lib/cn';
import { Minus, Plus } from 'lucide-react';

const TAG_LABEL: Record<NonNullable<MenuItem['tag']>, string> = {
  new: 'New',
  'staff-pick': 'Staff Pick',
  'after-dark': 'After Dark',
};

interface MenuItemCardProps {
  item: MenuItem;
  qty?: number;
  onAdd?: () => void;
  onChangeQty?: (qty: number) => void;
}

export function MenuItemCard({ item, qty = 0, onAdd, onChangeQty }: MenuItemCardProps) {
  const orderable = Boolean(onAdd || onChangeQty);

  return (
    <article className="vintage-border flex items-start justify-between gap-3 rounded-card bg-cream-dark p-4 shadow-sign-sm">
      <div className="min-w-0">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <h3 className="font-display text-lg leading-none tracking-wide text-coffee">{item.name}</h3>
          {item.tag && (
            <span
              className={cn(
                'rounded-sign border border-coffee px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide',
                item.tag === 'new' && 'bg-mustard text-coffee',
                item.tag === 'staff-pick' && 'bg-rust text-cream',
                item.tag === 'after-dark' && 'bg-coffee text-cream'
              )}
            >
              {TAG_LABEL[item.tag]}
            </span>
          )}
        </div>
        <p className="text-sm text-coffee-muted">{item.description}</p>
        <p className="mt-2 font-mono text-sm text-rust">${item.price.toFixed(2)}</p>
      </div>

      {orderable && (
        <div className="flex shrink-0 items-center">
          {qty === 0 ? (
            <button
              onClick={onAdd}
              aria-label={`Add ${item.name}`}
              className="flex h-9 items-center rounded-sign border-2 border-coffee bg-rust px-3 font-display text-sm tracking-wide text-cream shadow-sign-sm active:translate-y-[1px] active:shadow-none"
            >
              Add
            </button>
          ) : (
            <div className="flex items-center gap-1.5 rounded-sign border-2 border-coffee bg-cream px-1">
              <button
                onClick={() => onChangeQty?.(qty - 1)}
                aria-label={`Remove one ${item.name}`}
                className="flex h-8 w-8 items-center justify-center text-coffee"
              >
                <Minus size={14} />
              </button>
              <span className="w-4 text-center font-mono text-sm">{qty}</span>
              <button
                onClick={() => onChangeQty?.(qty + 1)}
                aria-label={`Add one more ${item.name}`}
                className="flex h-8 w-8 items-center justify-center text-coffee"
              >
                <Plus size={14} />
              </button>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
