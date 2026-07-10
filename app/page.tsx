import Link from 'next/link';
import { NeonHero } from '@/components/NeonHero';
import { MenuItemCard } from '@/components/MenuItemCard';
import { Button } from '@/components/Button';
import { MENU_ITEMS, HOURS, LOCATION } from '@/lib/mock-data';
import { QrCode, MapPin, Phone } from 'lucide-react';

export default function HomePage() {
  const featured = MENU_ITEMS.filter((item) => item.tag === 'staff-pick').slice(0, 3);
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todayHours = HOURS.find((h) => h.day === today);

  return (
    <main className="screen-scroll">
      <NeonHero />

      <section className="px-5 py-6">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-rust">Est. after hours</p>
        <h2 className="mt-1 font-display text-3xl tracking-wide text-coffee">
          Diner comfort, coffeehouse calm.
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-coffee-muted">
          Moonlit Reverie is where the late shift and the early risers cross paths — bottomless drip,
          griddle classics, and a booth that&apos;s always a little warmer than outside.
        </p>
      </section>

      <section className="mx-5 mb-6 rounded-card border-2 border-coffee bg-coffee p-4 text-cream shadow-sign">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-display text-xl tracking-wide">Order straight from your table</p>
            <p className="mt-1 text-xs text-cream/70">
              Scan the code on your table, browse the menu, and send your order to the kitchen — no
              waiting for a server.
            </p>
          </div>
          <QrCode size={36} className="shrink-0 text-moon-glow" />
        </div>
        <Link href="/scan" className="mt-3 block">
          <Button variant="secondary" className="w-full">
            Scan Your Table
          </Button>
        </Link>
      </section>

      <section className="px-5 pb-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-2xl tracking-wide text-coffee">Staff Picks</h2>
          <Link href="/menu" className="font-mono text-xs uppercase tracking-wide text-rust">
            Full Menu →
          </Link>
        </div>
        <div className="flex flex-col gap-3">
          {featured.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      <section className="px-5 pb-6">
        <Link href="/reserve">
          <Button size="lg" className="w-full">
            Reserve a Table
          </Button>
        </Link>
      </section>

      <section className="mx-5 mb-8 rounded-card border-2 border-coffee bg-cream-dark p-4">
        <h2 className="mb-3 font-display text-2xl tracking-wide text-coffee">Hours &amp; Location</h2>
        <div className="mb-3 flex items-start gap-2 text-sm">
          <MapPin size={16} className="mt-0.5 shrink-0 text-rust" />
          <span>{LOCATION.address}</span>
        </div>
        <div className="mb-4 flex items-start gap-2 text-sm">
          <Phone size={16} className="mt-0.5 shrink-0 text-rust" />
          <span>{LOCATION.phone}</span>
        </div>
        <ul className="divide-y divide-coffee/10 font-mono text-xs">
          {HOURS.map((h) => (
            <li
              key={h.day}
              className={`flex justify-between py-1.5 ${h.day === today ? 'text-rust font-semibold' : 'text-coffee-muted'}`}
            >
              <span>{h.day}</span>
              <span>{h.hours}</span>
            </li>
          ))}
        </ul>
        {todayHours && (
          <p className="mt-3 text-center text-xs text-coffee-muted">Open today until {todayHours.hours.split('–')[1]?.trim()}</p>
        )}
      </section>
    </main>
  );
}
