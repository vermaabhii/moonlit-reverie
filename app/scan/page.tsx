'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { TopBar } from '@/components/TopBar';
import { Button } from '@/components/Button';
import { getActiveTable, parseTableCode, setActiveTable, tableQrValue } from '@/lib/ordering';
import { AlertCircle, CheckCircle2, UtensilsCrossed } from 'lucide-react';

const SCANNER_ID = 'moonlit-qr-scanner';

export default function ScanPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'starting' | 'scanning' | 'error' | 'result'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [scannedTable, setScannedTable] = useState<number | null>(null);
  const [currentTable, setCurrentTable] = useState<number | null>(null);
  const scannerRef = useRef<import('html5-qrcode').Html5Qrcode | null>(null);

  useEffect(() => {
    setCurrentTable(getActiveTable());
  }, []);

  useEffect(() => {
    if (status === 'result') return;
    let cancelled = false;
    setStatus('starting');
    setErrorMessage(null);

    import('html5-qrcode').then(({ Html5Qrcode }) => {
      if (cancelled) return;
      const scanner = new Html5Qrcode(SCANNER_ID, { verbose: false });
      scannerRef.current = scanner;

      scanner
        .start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 240, height: 240 } },
          (decodedText) => {
            const table = parseTableCode(decodedText);
            if (table) {
              setActiveTable(table);
              setScannedTable(table);
              setStatus('result');
              // Don't call scanner.stop() here — flipping status to 'result'
              // already triggers the effect cleanup below, which stops it.
            }
            // non-matching codes are ignored — keep scanning
          },
          () => {
            // per-frame scan miss — expected constantly, ignore
          }
        )
        .then(() => {
          if (!cancelled) setStatus('scanning');
        })
        .catch((err: unknown) => {
          if (!cancelled) {
            setStatus('error');
            setErrorMessage(
              err instanceof Error ? err.message : 'Camera access was blocked. Enable it in your browser settings.'
            );
          }
        });
    });

    return () => {
      cancelled = true;
      const activeScanner = scannerRef.current;
      if (activeScanner && activeScanner.isScanning) {
        activeScanner
          .stop()
          .then(() => activeScanner.clear())
          .catch(() => {});
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status === 'result']);

  function simulateScan(table: number) {
    setActiveTable(table);
    setScannedTable(table);
    setStatus('result');
    // Don't call scannerRef.current?.stop() here either — same reason as
    // above, the effect cleanup handles it once status flips to 'result'.
  }

  if (status === 'result' && scannedTable) {
    return (
      <main className="screen-scroll flex flex-col items-center px-6 py-16 text-center">
        <CheckCircle2 size={52} className="text-rust" />
        <h1 className="mt-4 font-display text-3xl tracking-wide text-coffee">Table {scannedTable}</h1>
        <p className="mt-2 text-sm text-coffee-muted">
          You&apos;re ordering for this table. Browse the menu and send your order straight to the kitchen.
        </p>
        <Button size="lg" onClick={() => router.push('/menu')} className="mt-8 w-full">
          <UtensilsCrossed size={18} /> Start Ordering
        </Button>
      </main>
    );
  }

  return (
    <main className="screen-scroll">
      <TopBar title="Scan Your Table" />
      <div className="px-5 py-5">
        <p className="mb-4 text-center text-sm text-coffee-muted">
          Find the code on your table and point your camera at it to pull up the menu and order from your
          phone.
        </p>
        {currentTable && (
          <p className="mb-4 rounded-sign border-2 border-coffee/20 bg-cream-dark px-3 py-2 text-center font-mono text-xs text-coffee-muted">
            Currently ordering for Table {currentTable}
          </p>
        )}
        <div className="relative mx-auto aspect-square w-full max-w-xs overflow-hidden rounded-card border-2 border-coffee bg-coffee">
          <div id={SCANNER_ID} className="h-full w-full [&_video]:h-full [&_video]:w-full [&_video]:object-cover" />
          {status !== 'scanning' && (
            <div className="absolute inset-0 flex items-center justify-center bg-coffee/80 text-cream">
              {status === 'error' ? (
                <div className="flex flex-col items-center gap-2 px-6 text-center">
                  <AlertCircle size={28} />
                  <p className="text-xs">{errorMessage}</p>
                </div>
              ) : (
                <p className="font-mono text-xs">Starting camera…</p>
              )}
            </div>
          )}
        </div>

        <p className="mt-6 text-center font-mono text-[11px] text-coffee-muted">
          No table code on hand? Try a demo table, or{' '}
          <Link href="/tables" className="underline">
            view printable table codes
          </Link>
          .
        </p>
        <div className="mt-3 flex justify-center gap-2">
          {[3, 5, 7].map((t) => (
            <button
              key={t}
              onClick={() => simulateScan(t)}
              className="rounded-sign border-2 border-dashed border-coffee/40 px-4 py-2 font-mono text-xs text-coffee-muted"
            >
              Table {t}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
