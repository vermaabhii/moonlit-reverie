'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { clearActiveTable, getActiveTable, setActiveTable } from './ordering';

interface TableSessionValue {
  table: number | null;
  setTable: (table: number | null) => void;
  bannerDismissed: boolean;
  dismissBanner: () => void;
}

const TableSessionContext = createContext<TableSessionValue | undefined>(undefined);

export function TableSessionProvider({ children }: { children: ReactNode }) {
  const [table, setTableState] = useState<number | null>(null);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const raw = new URLSearchParams(window.location.search).get('table');
    if (raw) {
      const num = Number(raw);
      if (Number.isInteger(num) && num > 0) {
        setTableState(num);
        setBannerDismissed(false);
        setActiveTable(num);
        return;
      }
    }

    // Keep a scanned table active after a refresh or direct visit to another
    // customer page (for example, a saved cart link).
    setTableState(getActiveTable());
  }, []);

  const setTable = useCallback((next: number | null) => {
    setTableState(next);
    setBannerDismissed(false);
    if (next !== null) {
      setActiveTable(next);
    } else {
      clearActiveTable();
    }
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
