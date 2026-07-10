import type { Metadata, Viewport } from 'next';
import '@fontsource/bebas-neue';
import '@fontsource/source-sans-3/400.css';
import '@fontsource/source-sans-3/600.css';
import '@fontsource/source-sans-3/700.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import './globals.css';
import { BottomNav } from '@/components/BottomNav';
import { TableBanner } from '@/components/TableBanner';
import { TableSessionProvider } from '@/lib/table-session';

export const metadata: Metadata = {
  title: 'Moonlit Reverie — Diner & Coffee House',
  description: 'Retro diner-coffee house: menu, reservations, and a digital punch card you scan in-store.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'Moonlit Reverie',
    statusBarStyle: 'black-translucent',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#3D2314',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <TableSessionProvider>
            <TableBanner />
            {children}
            <BottomNav />
          </TableSessionProvider>
        </div>
      </body>
    </html>
  );
}
