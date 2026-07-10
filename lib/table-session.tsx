'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

interface TableSessionValue {
  /** The detected/selected table number for this browser session, or null if none. */
  table: number | null;
  /** Manually set (or clear, with null) the active table — e.g. from the Reserve flow's "Change" option. */
  setTable: (table: number | null) => void;
  /** Whether the "You're seated at Table N" banner has been dismissed by the user. */
  bannerDismissed: boolean;
  dismissBanner: () => void;
}

const TableSessionContext = createContext<TableSessionValue | undefined>(undefined);

/**
 * Reads an optional `?table=N` query param once on initial page load and keeps it in memory
 * for the rest of the browser session (it intentionally does NOT persist across a hard reload
 * or browser restart — that's the point of a "you just scanned the table's QR code" signal).
 */
export function TableSessionProvider({ children }: { children: ReactNode }) {
  const [table, setTableState] = useState<number | null>(null);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const raw = new URLSearchParams(window.location.search).get('table');
    if (!raw) return;
    const num = Number(raw);
    if (Number.isInteger(num) && num > 0) {
      setTableState(num);
      setBannerDismissed(false);
    }
  }, []);

  const setTable = useCallback((next: number | null) => {
    setTableState(next);
    setBannerDismissed(false);
  }, []);

  const dismissBanner = useCallback(() => setBannerDismissed(true), []);

  return (
    <TableSessionContext.Provider value={{ table, setTable, bannerDismissed, dismissBanner }}>
      {children}
    </TableSessionContext.Provider>
  );
}

export function useTableSession() {
  const ctx = useContext(TableSessionContext);
  if (!ctx) {
    throw new Error('useTableSession must be used within a TableSessionProvider');
  }
  return ctx;
}
