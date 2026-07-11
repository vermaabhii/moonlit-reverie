'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { TopBar } from '@/components/TopBar';
import { DEMO_TABLE_COUNT, tableQrValue } from '@/lib/ordering';

export default function TablesPage() {
  const [codes, setCodes] = useState<Record<number, string>>({});

  useEffect(() => {
    let cancelled = false;
    async function render() {
      const entries = await Promise.all(
        Array.from({ length: DEMO_TABLE_COUNT }, async (_, i) => {
          const table = i + 1;
          const url = await QRCode.toDataURL(tableQrValue(table), {
            margin: 1,
            width: 220,
            color: { dark: '#3D2314', light: '#F7F0E4' },
          });
          return [table, url] as const;
        })
      );
      if (!cancelled) setCodes(Object.fromEntries(entries));
    }
    render();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="screen-scroll">
      <TopBar title="Table Codes" showBack />
      <p className="px-5 pt-4 text-center text-sm text-coffee-muted">
        In a real diner these would be printed table tents. For this demo, open this page on another
        screen and scan one with your phone on the Scan tab.
      </p>
      <div className="grid grid-cols-2 gap-4 px-5 py-6">
        {Array.from({ length: DEMO_TABLE_COUNT }, (_, i) => i + 1).map((table) => (
          <div key={table} className="vintage-border flex flex-col items-center gap-2 rounded-card bg-cream-dark p-3">
            {codes[table] ? (
              <img src={codes[table]} alt={`Table ${table} code`} className="rounded-sign" />
            ) : (
              <div className="h-[220px] w-[220px] animate-pulse rounded-sign bg-coffee/10" />
            )}
            <p className="font-display text-lg tracking-wide text-coffee">Table {table}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
