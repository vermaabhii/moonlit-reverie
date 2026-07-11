'use client';

import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { DEMO_TABLE_COUNT, tableQrValue } from '@/lib/ordering';

export default function AdminTablesPage() {
  const [tables, setTables] = useState<{ id: number; url: string }[]>([]);

  useEffect(() => {
    const list = [];
    for (let i = 1; i <= DEMO_TABLE_COUNT; i++) {
      list.push({ id: i, url: tableQrValue(i) });
    }
    setTables(list);
  }, []);

  function handleCopy(url: string) {
    navigator.clipboard.writeText(url);
    alert('Copied link!');
  }

  return (
    <div className="p-8">
      <h2 className="mb-6 text-2xl font-bold tracking-tight text-neutral-900">Table QR Codes</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {tables.map(table => (
          <div key={table.id} className="flex flex-col items-center rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 font-bold text-neutral-900">Table {table.id}</h3>
            <div className="mb-4 rounded-xl bg-white p-3 shadow-sm border border-neutral-100">
              <QRCodeSVG value={table.url} size={120} />
            </div>
            <button 
              onClick={() => handleCopy(table.url)}
              className="rounded-md border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              Copy Link
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
