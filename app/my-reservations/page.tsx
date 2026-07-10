'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { TopBar } from '@/components/TopBar';
import { Button } from '@/components/Button';
import { getSession, SessionUser } from '@/lib/auth';
import { cancelReservation, getReservationsForUser } from '@/lib/reservations';
import type { Reservation } from '@/lib/mock-data';
import { CalendarX2, Users, Clock } from 'lucide-react';

export default function MyReservationsPage() {
  const [session, setSession] = useState<SessionUser | null | undefined>(undefined);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    const s = getSession();
    setSession(s);
    if (s) setReservations(getReservationsForUser(s.id));
  }, []);

  function handleCancel(id: string) {
    cancelReservation(id);
    if (session) setReservations(getReservationsForUser(session.id));
  }

  if (session === undefined) return null;

  if (!session) {
    return (
      <main className="screen-scroll flex flex-col items-center px-6 py-16 text-center">
        <TopBar title="My Reservations" />
        <p className="mt-10 text-sm text-coffee-muted">Sign in to see your reservations.</p>
        <Link href="/login" className="mt-6 w-full">
          <Button className="w-full">Sign In</Button>
        </Link>
      </main>
    );
  }

  return (
    <main className="screen-scroll">
      <TopBar title="My Reservations" />
      <div className="flex flex-col gap-3 px-5 py-5">
        {reservations.length === 0 && (
          <div className="mt-8 text-center text-sm text-coffee-muted">
            No reservations yet.
            <Link href="/reserve" className="mt-4 block">
              <Button className="w-full">Reserve a Table</Button>
            </Link>
          </div>
        )}
        {reservations.map((r) => (
          <div key={r.id} className="vintage-border rounded-card bg-cream-dark p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="font-display text-xl tracking-wide text-coffee">
                {new Date(r.date + 'T00:00:00').toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
              <span className="font-mono text-xs text-rust">{r.confirmationCode}</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-coffee-muted">
              <span className="flex items-center gap-1">
                <Clock size={14} /> {r.time}
              </span>
              <span className="flex items-center gap-1">
                <Users size={14} /> {r.partySize}
              </span>
            </div>
            {r.notes && <p className="mt-2 text-sm text-coffee-muted">{r.notes}</p>}
            <button
              onClick={() => handleCancel(r.id)}
              className="mt-3 flex items-center gap-1.5 font-mono text-xs uppercase tracking-wide text-rust"
            >
              <CalendarX2 size={14} /> Cancel Reservation
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
