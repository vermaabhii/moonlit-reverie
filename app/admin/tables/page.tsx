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
    <div className="p-5">
      <h2 className="mb-4 font-display text-xl text-coffee">Table QR Codes</h2>
      <div className="grid grid-cols-2 gap-4">
        {tables.map(table => (
          <div key={table.id} className="flex flex-col items-center rounded-card border-2 border-coffee/10 bg-white p-4">
            <h3 className="mb-2 font-display text-lg text-coffee">Table {table.id}</h3>
            <div className="mb-3 rounded-lg bg-white p-2 shadow-sm border border-gray-100">
              <QRCodeSVG value={table.url} size={100} />
            </div>
            <button 
              onClick={() => handleCopy(table.url)}
              className="text-xs text-coffee-muted underline hover:text-coffee"
            >
              Copy Link
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
