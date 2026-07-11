import { BottomNav } from '@/components/BottomNav';
import { TableBanner } from '@/components/TableBanner';
import { TableSessionProvider } from '@/lib/table-session';

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <TableSessionProvider>
        <TableBanner />
        {children}
        <BottomNav />
      </TableSessionProvider>
    </div>
  );
}
